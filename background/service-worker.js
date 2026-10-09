/**
 * Page Zoom Manager - Background Service Worker
 * Direct clean-link zoom management, per-tab isolation,
 * real-time cross-tab synchronization in record mode, and badge management.
 */

// Default settings configuration
const DEFAULT_SETTINGS = {
  enabled: true,
  listMode: 'blacklist', // 'blacklist' | 'whitelist'
  blacklist: [],
  whitelist: [],
  savedZooms: {}, // { [cleanUrl]: zoomFactor } e.g. { 'https://example.com/page': 1.25 }
  autoSave: 'off', // 'off' | 'always' (global default)
  urlAutoSave: {}, // { [cleanUrl]: 'on' | 'off' } (per-address record mode)
  stepSize: 0.10, // 10% default increment
  showBadge: true,
  language: '', // empty string = auto-detect browser language
  shortcuts: {
    zoomIn: 'Ctrl + +',
    zoomOut: 'Ctrl + -',
    reset: 'Ctrl + 0',
    save: 'Alt + S',
    delete: 'Alt + D',
    wheelZoom: true,
    middleClickReset: true
  }
};

// Tab programmatic set-zoom tracking to eliminate echo feedback loops:
// tabId -> { targetZoom: number, expiresAt: number }
const programmaticTabExpectations = new Map();

function markTabProgrammatic(tabId, targetZoom, durationMs = 800) {
  programmaticTabExpectations.set(tabId, {
    targetZoom: Math.round(targetZoom * 100) / 100,
    expiresAt: Date.now() + durationMs
  });
}

function isProgrammaticEcho(tabId, newZoomFactor) {
  const record = programmaticTabExpectations.get(tabId);
  if (!record) return false;
  if (Date.now() > record.expiresAt) {
    programmaticTabExpectations.delete(tabId);
    return false;
  }
  if (typeof newZoomFactor === 'number') {
    const clamped = Math.round(newZoomFactor * 100) / 100;
    if (Math.abs(clamped - record.targetZoom) < 0.005) {
      programmaticTabExpectations.delete(tabId);
    }
  }
  // While within the programmatic window, suppress ALL events for this tab
  return true;
}

/**
 * Retrieve all settings with defaults
 */
async function getSettings() {
  const stored = await chrome.storage.local.get('settings');
  const settings = { ...DEFAULT_SETTINGS, ...stored.settings };
  if (!settings.savedZooms) settings.savedZooms = {};
  if (!settings.urlAutoSave) settings.urlAutoSave = {};
  return settings;
}

/**
 * Completely deactivate extension overrides and restore browser defaults
 */
async function deactivateAllTabs() {
  programmaticTabExpectations.clear();

  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (!tab?.id) continue;
      try {
        await chrome.action.setBadgeText({ tabId: tab.id, text: '' });
        await chrome.tabs.setZoomSettings(tab.id, { mode: 'automatic', scope: 'per-origin' });
        await chrome.tabs.setZoom(tab.id, 1.0);
      } catch {}
    }
  } catch {}
}

/**
 * Save updated settings and trigger global activation/deactivation if toggled
 */
async function saveSettings(newSettings) {
  const previous = await getSettings();
  await chrome.storage.local.set({ settings: newSettings });

  if (previous.enabled !== newSettings.enabled) {
    if (!newSettings.enabled) {
      await deactivateAllTabs();
    } else {
      await initAllTabsZoomSettings();
    }
  }

  return newSettings;
}

/**
 * Canonical Clean URL Parser (SonarQube S8786 compliant - linear safety)
 * Strips query strings, hash tags, and redundant trailing slashes.
 */
function getCleanUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return null;
  try {
    const url = new URL(urlStr);
    if (!['http:', 'https:', 'file:'].includes(url.protocol)) {
      return null;
    }
    const origin = url.origin;
    const hostname = url.hostname.toLowerCase();

    // Strip trailing slashes safely unless root '/'
    let p = url.pathname;
    while (p.length > 1 && p.endsWith('/')) {
      p = p.slice(0, -1);
    }
    const pathname = p || '/';
    const cleanUrl = `${origin}${pathname}`;

    return {
      cleanUrl,
      origin,
      hostname,
      pathname
    };
  } catch {
    return null;
  }
}

/**
 * Check whether record mode is active for a specific clean URL
 */
function isRecordModeActive(settings, cleanUrl) {
  if (!cleanUrl) return false;
  if (typeof settings.urlAutoSave?.[cleanUrl] === 'string') {
    return settings.urlAutoSave[cleanUrl] === 'on';
  }
  return settings.autoSave === 'always';
}

/**
 * Determine effective autoSave UI mode for a tab ('off' | 'url' | 'always')
 */
function getEffectiveAutoSaveMode(settings, cleanUrl) {
  if (!cleanUrl) return 'off';
  if (settings.urlAutoSave?.[cleanUrl] === 'on') {
    return settings.autoSave === 'always' ? 'always' : 'url';
  }
  if (settings.urlAutoSave?.[cleanUrl] === 'off') {
    return 'off';
  }
  return settings.autoSave === 'always' ? 'always' : 'off';
}

/**
 * Check if the extension should be active on a given hostname based on blacklist/whitelist
 */
function isExtensionActiveForHostname(hostname, settings) {
  if (!settings.enabled || !hostname) return false;

  const inList = (list) => {
    return list.some(item => {
      const clean = item?.trim()?.toLowerCase();
      return clean && (hostname === clean || hostname.endsWith(`.${clean}`));
    });
  };

  if (settings.listMode === 'whitelist') {
    return inList(settings.whitelist || []);
  } else {
    return !inList(settings.blacklist || []);
  }
}

/**
 * Update the badge text and color for a given tab
 */
async function updateBadge(tabId, zoomFactor, settings) {
  if (!settings.showBadge || !settings.enabled) {
    try {
      await chrome.action.setBadgeText({ tabId, text: '' });
    } catch {}
    return;
  }

  const percent = Math.round((zoomFactor || 1.0) * 100);
  const text = `${percent}%`;

  try {
    await chrome.action.setBadgeText({ tabId, text });
    await chrome.action.setBadgeBackgroundColor({
      tabId,
      color: percent === 100 ? '#475569' : '#2563EB'
    });
  } catch {}
}

// ==================== CROSS-TAB REAL-TIME SYNCHRONIZATION ====================

let urlSyncTimer = null;
let isSyncing = false;
const pendingUrlSyncs = new Map(); // cleanUrl -> { targetZoom, sourceTabId }

/**
 * Apply zoom directly to a single tab with per-tab scoping and echo guard
 */
async function applyZoomDirectly(tabId, targetZoom, settings) {
  try {
    const currentZoom = await chrome.tabs.getZoom(tabId);
    if (Math.abs(currentZoom - targetZoom) < 0.005) return;

    markTabProgrammatic(tabId, targetZoom, 800);
    const zSettings = await chrome.tabs.getZoomSettings(tabId);
    if (zSettings.scope !== 'per-tab') {
      await chrome.tabs.setZoomSettings(tabId, { mode: 'automatic', scope: 'per-tab' });
    }
    await chrome.tabs.setZoom(tabId, targetZoom);
    await updateBadge(tabId, targetZoom, settings);
  } catch {}
}

/**
 * Core synchronizer: broadcasts zoom to tabs with the exact same clean URL
 */
async function syncZoomToMatchingTabs(cleanUrl, targetZoom, sourceTabId) {
  if (!cleanUrl || isSyncing) return;
  isSyncing = true;

  try {
    const allTabs = await chrome.tabs.query({});
    const settings = await getSettings();

    for (const tab of allTabs) {
      if (tab.id === sourceTabId || !tab.url) continue;

      const tabInfo = getCleanUrl(tab.url);
      if (!tabInfo || tabInfo.cleanUrl !== cleanUrl) continue;

      if (!isExtensionActiveForHostname(tabInfo.hostname, settings)) continue;

      markTabProgrammatic(tab.id, targetZoom, 800);
      await applyZoomDirectly(tab.id, targetZoom, settings);
    }
  } catch {} finally {
    isSyncing = false;
  }
}

/**
 * Throttled URL zoom synchronizer (optimizes continuous slider dragging across tabs)
 */
function queueUrlSync(cleanUrl, targetZoom, sourceTabId) {
  if (!cleanUrl) return;
  pendingUrlSyncs.set(cleanUrl, { targetZoom, sourceTabId });

  if (urlSyncTimer) {
    clearTimeout(urlSyncTimer);
  }

  urlSyncTimer = setTimeout(async () => {
    urlSyncTimer = null;
    const batch = new Map(pendingUrlSyncs);
    pendingUrlSyncs.clear();

    for (const [targetUrl, data] of batch) {
      await syncZoomToMatchingTabs(targetUrl, data.targetZoom, data.sourceTabId);
    }
  }, 25);
}

/**
 * Apply per-tab zoom settings and apply effective saved zoom on navigation
 */
async function applyZoomToTab(tabId, urlStr) {
  const urlInfo = getCleanUrl(urlStr);
  const settings = await getSettings();

  if (!urlInfo) {
    try {
      await chrome.action.setBadgeText({ tabId, text: '' });
    } catch {}
    return;
  }

  if (!settings.enabled) {
    try {
      await chrome.action.setBadgeText({ tabId, text: '' });
      await chrome.tabs.setZoomSettings(tabId, { mode: 'automatic', scope: 'per-origin' });
    } catch {}
    return;
  }

  const isActive = isExtensionActiveForHostname(urlInfo.hostname, settings);
  if (!isActive) {
    try {
      await chrome.action.setBadgeText({ tabId, text: '' });
    } catch {}
    return;
  }

  const targetZoom = typeof settings.savedZooms[urlInfo.cleanUrl] === 'number'
    ? settings.savedZooms[urlInfo.cleanUrl]
    : 1.0;

  try {
    markTabProgrammatic(tabId, targetZoom, 800);
    const zSettings = await chrome.tabs.getZoomSettings(tabId);
    if (zSettings.scope !== 'per-tab') {
      await chrome.tabs.setZoomSettings(tabId, { mode: 'automatic', scope: 'per-tab' });
    }
    await chrome.tabs.setZoom(tabId, targetZoom);
    await updateBadge(tabId, targetZoom, settings);
  } catch {}
}

/**
 * Initialize per-tab zoom settings across all currently open tabs
 */
async function initAllTabsZoomSettings() {
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id && tab.url && ['http:', 'https:', 'file:'].some(p => tab.url.startsWith(p))) {
        await applyZoomToTab(tab.id, tab.url);
      }
    }
  } catch {}
}

// ==================== EVENT LISTENERS ====================

// Initialize settings and open tabs on installation or reload
chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get('settings');
  if (!current.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
  await initAllTabsZoomSettings();
});

// Initialize open tabs on browser startup
chrome.runtime.onStartup.addListener(async () => {
  await initAllTabsZoomSettings();
});

// Tab created - enforce per-tab scoping immediately
chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab?.id) return;
  try {
    await chrome.tabs.setZoomSettings(tab.id, { mode: 'automatic', scope: 'per-tab' });
  } catch {}
});

// Tab updated (navigation or status complete)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.status === 'loading' || changeInfo.url) {
    const url = changeInfo.url || tab.url;
    if (url) {
      await applyZoomToTab(tabId, url);
    }
  }
});

// Tab activated (switched tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab?.url) {
      const settings = await getSettings();
      const urlInfo = getCleanUrl(tab.url);
      if (!urlInfo || !isExtensionActiveForHostname(urlInfo.hostname, settings)) {
        await chrome.action.setBadgeText({ tabId: activeInfo.tabId, text: '' });
        return;
      }
      const zoom = await chrome.tabs.getZoom(activeInfo.tabId);
      await updateBadge(activeInfo.tabId, zoom, settings);
    }
  } catch {}
});

// Tab zoom changed by user or extension
chrome.tabs.onZoomChange.addListener(async (zoomChangeInfo) => {
  const { tabId, newZoomFactor } = zoomChangeInfo;

  // Complete loop protection: ignore programmatic echoes from our own setZoom calls!
  if (isProgrammaticEcho(tabId, newZoomFactor)) {
    const settings = await getSettings();
    await updateBadge(tabId, newZoomFactor, settings);
    return;
  }

  // If a global sync is active, ignore all incoming zoom events to prevent ping-pong!
  if (isSyncing) return;

  const settings = await getSettings();
  if (!settings.enabled) return;

  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab?.url) return;

    // Strict User Focus Verification:
    // Only the ACTIVE tab in the LAST FOCUSED WINDOW can initiate a user-driven zoom sync!
    const [focusedTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!focusedTab || focusedTab.id !== tabId) {
      await updateBadge(tabId, newZoomFactor, settings);
      return;
    }

    const urlInfo = getCleanUrl(tab.url);
    if (!urlInfo || !isExtensionActiveForHostname(urlInfo.hostname, settings)) {
      await chrome.action.setBadgeText({ tabId, text: '' });
      return;
    }

    const clamped = Math.round(newZoomFactor * 100) / 100;
    await updateBadge(tabId, clamped, settings);

    // If NOT in record mode, other tabs must NEVER be affected!
    if (!isRecordModeActive(settings, urlInfo.cleanUrl)) {
      return;
    }

    // In record mode: update saved zoom and sync all matching tabs!
    settings.savedZooms[urlInfo.cleanUrl] = clamped;
    await saveSettings(settings);
    queueUrlSync(urlInfo.cleanUrl, clamped, tabId);
  } catch {}
});

// Clean up tracking when tabs are closed
chrome.tabs.onRemoved.addListener(async (tabId) => {
  programmaticTabExpectations.delete(tabId);
});

// ==================== TAB RESOLUTION HELPER ====================

/**
 * Robust tabId resolver: checks message payload, sender.tab.id, or last focused window
 */
async function resolveTabId(messageTabId, sender) {
  if (typeof messageTabId === 'number') {
    return messageTabId;
  }
  if (typeof sender?.tab?.id === 'number') {
    return sender.tab.id;
  }
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    return activeTab?.id ?? null;
  } catch {
    return null;
  }
}

// ==================== MODULAR MESSAGE HANDLERS (SonarQube S3776 compliant) ====================

async function handleGetTabInfo(message, sender) {
  const tabId = await resolveTabId(message.tabId, sender);
  const activeTab = tabId ? await chrome.tabs.get(tabId).catch(() => null) : null;
  if (!activeTab?.url) {
    return { success: false, error: 'No active tab or URL' };
  }

  const settings = await getSettings();
  const urlInfo = getCleanUrl(activeTab.url);
  const isApplicable = !!urlInfo;
  const isActive = urlInfo ? isExtensionActiveForHostname(urlInfo.hostname, settings) : false;
  let zoomFactor = 1.0;
  try {
    zoomFactor = await chrome.tabs.getZoom(activeTab.id);
  } catch {}

  const savedZoom = urlInfo ? settings.savedZooms[urlInfo.cleanUrl] ?? null : null;
  const effectiveAutoSave = urlInfo ? getEffectiveAutoSaveMode(settings, urlInfo.cleanUrl) : 'off';

  return {
    success: true,
    tabId: activeTab.id,
    url: activeTab.url,
    urlInfo,
    isApplicable,
    isActive,
    zoomFactor,
    savedZoom,
    effectiveAutoSave,
    settings
  };
}

async function handleSetZoom(message, sender) {
  const tabId = await resolveTabId(message.tabId, sender);
  if (!tabId) {
    return { success: false, error: 'Target tab not found' };
  }
  const { zoomFactor } = message;
  const clampedZoom = Math.min(5.0, Math.max(0.25, Math.round(zoomFactor * 100) / 100));
  markTabProgrammatic(tabId, clampedZoom, 800);

  try {
    const zSettings = await chrome.tabs.getZoomSettings(tabId);
    if (zSettings.scope !== 'per-tab') {
      await chrome.tabs.setZoomSettings(tabId, { mode: 'automatic', scope: 'per-tab' });
    }
    await chrome.tabs.setZoom(tabId, clampedZoom);

    const settings = await getSettings();
    const tab = await chrome.tabs.get(tabId);
    const urlInfo = getCleanUrl(tab.url);

    let savedZoom = null;

    if (urlInfo) {
      if (isRecordModeActive(settings, urlInfo.cleanUrl)) {
        settings.savedZooms[urlInfo.cleanUrl] = clampedZoom;
        await saveSettings(settings);
        savedZoom = clampedZoom;
        queueUrlSync(urlInfo.cleanUrl, clampedZoom, tabId);
      } else {
        savedZoom = settings.savedZooms[urlInfo.cleanUrl] ?? null;
      }
      await updateBadge(tabId, clampedZoom, settings);
    }

    return {
      success: true,
      zoomFactor: clampedZoom,
      savedZoom
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function handleAdjustZoom(message, sender) {
  const tabId = await resolveTabId(message.tabId, sender);
  if (!tabId) {
    return { success: false, error: 'Target tab not found' };
  }
  const delta = message.delta || 0;

  try {
    const current = await chrome.tabs.getZoom(tabId);
    const settings = await getSettings();
    const step = settings.stepSize || 0.10;
    const newZoom = Math.min(5.0, Math.max(0.25, Math.round((current + (delta * step)) * 100) / 100));

    return await handleSetZoom({ tabId, zoomFactor: newZoom }, sender);
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function handleResetZoom(message, sender) {
  const tabId = await resolveTabId(message.tabId, sender);
  if (!tabId) {
    return { success: false, error: 'Target tab not found' };
  }
  markTabProgrammatic(tabId, 1.0, 800);

  try {
    const zSettings = await chrome.tabs.getZoomSettings(tabId);
    if (zSettings.scope !== 'per-tab') {
      await chrome.tabs.setZoomSettings(tabId, { mode: 'automatic', scope: 'per-tab' });
    }
    await chrome.tabs.setZoom(tabId, 1.0);
    const settings = await getSettings();

    const tab = await chrome.tabs.get(tabId);
    const urlInfo = getCleanUrl(tab.url);
    let savedZoom = null;

    if (urlInfo) {
      if (isRecordModeActive(settings, urlInfo.cleanUrl)) {
        delete settings.savedZooms[urlInfo.cleanUrl];
        await saveSettings(settings);
        queueUrlSync(urlInfo.cleanUrl, 1.0, tabId);
      } else {
        savedZoom = settings.savedZooms[urlInfo.cleanUrl] ?? null;
      }
      await updateBadge(tabId, 1.0, settings);
    }
    return { success: true, zoomFactor: 1.0, savedZoom };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function handleSaveCurrentZoom(message, sender) {
  const tabId = await resolveTabId(message.tabId, sender);
  if (!tabId) {
    return { success: false, error: 'Target tab not found' };
  }
  const tab = await chrome.tabs.get(tabId);
  const urlInfo = getCleanUrl(tab.url);
  if (!urlInfo) return { success: false, error: 'Cannot save for this URL' };

  const zoom = await chrome.tabs.getZoom(tabId);
  const clamped = Math.round(zoom * 100) / 100;
  const settings = await getSettings();

  settings.savedZooms[urlInfo.cleanUrl] = clamped;
  await saveSettings(settings);
  await syncZoomToMatchingTabs(urlInfo.cleanUrl, clamped, tabId);

  return {
    success: true,
    zoomFactor: clamped,
    savedZoom: clamped
  };
}

async function handleDeleteSavedZoom(message, sender) {
  const tabId = await resolveTabId(message.tabId, sender);
  if (!tabId) {
    return { success: false, error: 'Target tab not found' };
  }
  const tab = await chrome.tabs.get(tabId);
  const urlInfo = getCleanUrl(tab.url);
  if (!urlInfo) return { success: false, error: 'Cannot delete for this URL' };

  const settings = await getSettings();
  delete settings.savedZooms[urlInfo.cleanUrl];
  if (settings.urlAutoSave) delete settings.urlAutoSave[urlInfo.cleanUrl];
  await saveSettings(settings);

  markTabProgrammatic(tabId, 1.0, 800);
  try {
    const zSettings = await chrome.tabs.getZoomSettings(tabId);
    if (zSettings.scope !== 'per-tab') {
      await chrome.tabs.setZoomSettings(tabId, { mode: 'automatic', scope: 'per-tab' });
    }
    await chrome.tabs.setZoom(tabId, 1.0);
    await updateBadge(tabId, 1.0, settings);
  } catch {}

  queueUrlSync(urlInfo.cleanUrl, 1.0, tabId);
  return { success: true, zoomFactor: 1.0, savedZoom: null };
}

async function handleToggleSiteRule(message, sender) {
  const tabId = await resolveTabId(message.tabId, sender);
  if (!tabId) {
    return { success: false, error: 'Target tab not found' };
  }
  const tab = await chrome.tabs.get(tabId);
  const urlInfo = getCleanUrl(tab.url);
  if (!urlInfo) return { success: false, error: 'Invalid URL' };

  const settings = await getSettings();
  const hostname = urlInfo.hostname;
  const listName = settings.listMode === 'whitelist' ? 'whitelist' : 'blacklist';
  const list = settings[listName] || [];

  const index = list.indexOf(hostname);
  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(hostname);
  }
  settings[listName] = list;
  await saveSettings(settings);

  const isActive = isExtensionActiveForHostname(hostname, settings);
  if (!isActive) {
    await chrome.action.setBadgeText({ tabId, text: '' });
  } else {
    const currentZoom = await chrome.tabs.getZoom(tabId);
    await updateBadge(tabId, currentZoom, settings);
  }

  return { success: true, isActive, list: settings[listName] };
}

// Runtime message dispatcher
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      const { action } = message;

      if (action === 'GET_SETTINGS') {
        const settings = await getSettings();
        sendResponse({ success: true, settings });
        return;
      }
      if (action === 'SAVE_SETTINGS') {
        const updated = await saveSettings(message.settings);
        sendResponse({ success: true, settings: updated });
        return;
      }
      if (action === 'GET_TAB_INFO') {
        sendResponse(await handleGetTabInfo(message, sender));
        return;
      }
      if (action === 'SET_ZOOM') {
        sendResponse(await handleSetZoom(message, sender));
        return;
      }
      if (action === 'ADJUST_ZOOM') {
        sendResponse(await handleAdjustZoom(message, sender));
        return;
      }
      if (action === 'RESET_ZOOM') {
        sendResponse(await handleResetZoom(message, sender));
        return;
      }
      if (action === 'SAVE_CURRENT_ZOOM') {
        sendResponse(await handleSaveCurrentZoom(message, sender));
        return;
      }
      if (action === 'DELETE_SAVED_ZOOM') {
        sendResponse(await handleDeleteSavedZoom(message, sender));
        return;
      }
      if (action === 'TOGGLE_SITE_RULE') {
        sendResponse(await handleToggleSiteRule(message, sender));
        return;
      }

      sendResponse({ success: false, error: 'Unknown action' });
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  })();
  return true;
});
