/**
 * Page Zoom Manager - Popup Logic
 * Modern, responsive interface controller with live i18n switching,
 * robust multi-key shortcut recording, site list management, and tab zoom controls.
 */

import { t, detectBrowserLanguage } from '../locales/translations.js';

// Internal Popup State
const state = {
  tabId: null,
  url: '',
  urlInfo: null,
  isApplicable: true,
  isActive: true,
  zoomFactor: 1.0,
  savedZoom: null,
  settings: null,
  activeLang: 'en'
};

// Shortcut recording state
let activeRecording = null; // { shortcutKey: string, btn: HTMLElement, cleanup: Function }

// DOM Elements cache
const DOM = {
  domainBadge: document.getElementById('domainBadge'),
  settingsLangSelect: document.getElementById('settingsLangSelect'),
  globalEnableToggle: document.getElementById('globalEnableToggle'),
  navTabs: document.querySelectorAll('.nav-tab'),
  tabContents: document.querySelectorAll('.tab-content'),
  systemPageAlert: document.getElementById('systemPageAlert'),
  zoomPercentageContainer: document.getElementById('zoomPercentageContainer'),
  zoomPercentageDisplay: document.getElementById('zoomPercentageDisplay'),
  zoomPercentageInput: document.getElementById('zoomPercentageInput'),
  zoomSlider: document.getElementById('zoomSlider'),
  btnZoomIn: document.getElementById('btnZoomIn'),
  btnZoomOut: document.getElementById('btnZoomOut'),
  btnResetZoom: document.getElementById('btnResetZoom'),
  presetChips: document.querySelectorAll('.chip'),
  savedStatusPill: document.getElementById('savedStatusPill'),
  btnSaveUrl: document.getElementById('btnSaveUrl'),
  btnDeleteSaved: document.getElementById('btnDeleteSaved'),
  autoSaveSelect: document.getElementById('autoSaveSelect'),
  listModeSelect: document.getElementById('listModeSelect'),
  modeDesc: document.getElementById('modeDesc'),
  currentSiteText: document.getElementById('currentSiteText'),
  btnToggleCurrentSite: document.getElementById('btnToggleCurrentSite'),
  manualSiteInput: document.getElementById('manualSiteInput'),
  btnAddManualSite: document.getElementById('btnAddManualSite'),
  sitesCountText: document.getElementById('sitesCountText'),
  btnClearSiteList: document.getElementById('btnClearSiteList'),
  sitesListContainer: document.getElementById('sitesListContainer'),
  shortcutKeyBtns: document.querySelectorAll('.shortcut-key-btn'),
  btnResetShortcuts: document.getElementById('btnResetShortcuts'),
  stepSizeSelect: document.getElementById('stepSizeSelect'),
  showBadgeToggle: document.getElementById('showBadgeToggle')
};

// ==================== I18N RENDERING ====================

function renderTranslations(lang) {
  state.activeLang = lang;

  // Apply to all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(lang, key);
  });

  // Update Settings Lang select
  if (DOM.settingsLangSelect) {
    DOM.settingsLangSelect.value = lang;
  }

  // Update dynamic elements
  updatePersistenceUI();
  updateModeDesc();
  updateCurrentSiteButton();
  if (DOM.zoomPercentageDisplay) {
    DOM.zoomPercentageDisplay.title = t(lang, 'zoomNumberHint');
  }
}

function updateModeDesc() {
  const mode = DOM.listModeSelect.value;
  DOM.modeDesc.textContent = mode === 'whitelist' ? t(state.activeLang, 'whitelistDesc') : t(state.activeLang, 'blacklistDesc');
}

function updateCurrentSiteButton() {
  if (!state.urlInfo || !state.settings) return;
  const listName = state.settings.listMode === 'whitelist' ? 'whitelist' : 'blacklist';
  const list = state.settings[listName] || [];
  const inList = list.includes(state.urlInfo.hostname);

  if (inList) {
    DOM.btnToggleCurrentSite.textContent = t(state.activeLang, 'btnRemoveCurrent');
    DOM.btnToggleCurrentSite.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    DOM.btnToggleCurrentSite.style.color = '#f87171';
  } else {
    DOM.btnToggleCurrentSite.textContent = t(state.activeLang, 'btnAddCurrent');
    DOM.btnToggleCurrentSite.style.borderColor = '';
    DOM.btnToggleCurrentSite.style.color = '';
  }
}

// ==================== STATE & UI UPDATES ====================

function updateZoomDisplay(factor) {
  state.zoomFactor = Math.round(factor * 100) / 100;
  const pct = Math.round(state.zoomFactor * 100);
  DOM.zoomPercentageDisplay.textContent = `${pct}%`;
  if (DOM.zoomPercentageInput && document.activeElement !== DOM.zoomPercentageInput) {
    DOM.zoomPercentageInput.value = String(pct);
  }
  DOM.zoomSlider.value = pct;

  // Preset chips highlight
  DOM.presetChips.forEach(chip => {
    const chipVal = Number.parseFloat(chip.dataset.preset);
    if (Math.abs(chipVal - state.zoomFactor) < 0.01) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

function updatePersistenceUI() {
  const pill = DOM.savedStatusPill;
  pill.className = 'status-pill';

  if (typeof state.savedZoom === 'number') {
    pill.classList.add('saved-url');
    pill.textContent = `${t(state.activeLang, 'savedForUrl')} (${Math.round(state.savedZoom * 100)}%)`;
  } else {
    pill.textContent = t(state.activeLang, 'noSavedZoom');
  }
}

function renderSitesList() {
  const listName = state.settings.listMode === 'whitelist' ? 'whitelist' : 'blacklist';
  const list = state.settings[listName] || [];

  DOM.sitesCountText.textContent = `${t(state.activeLang, 'tabSites')} (${list.length})`;
  DOM.sitesListContainer.innerHTML = '';

  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = t(state.activeLang, 'emptyList');
    DOM.sitesListContainer.appendChild(empty);
    return;
  }

  list.forEach(item => {
    const row = document.createElement('div');
    row.className = 'site-item';

    const name = document.createElement('span');
    name.textContent = item;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'site-remove-btn';
    removeBtn.title = 'Remove';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', async () => {
      const idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
        state.settings[listName] = list;
        await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });
        renderSitesList();
        updateCurrentSiteButton();
      }
    });

    row.appendChild(name);
    row.appendChild(removeBtn);
    DOM.sitesListContainer.appendChild(row);
  });
}

function renderShortcutsUI() {
  const sc = state.settings.shortcuts || {};
  DOM.shortcutKeyBtns.forEach(btn => {
    const key = btn.dataset.shortcut;
    if (sc[key]) {
      btn.textContent = sc[key];
    }
  });
}

function selectDropdownByFloat(selectElement, targetValue) {
  const targetFloat = Number.parseFloat(targetValue);
  for (let i = 0; i < selectElement.options.length; i++) {
    const optFloat = Number.parseFloat(selectElement.options[i].value);
    if (Math.abs(optFloat - targetFloat) < 0.001) {
      selectElement.selectedIndex = i;
      return;
    }
  }
}

// ==================== INITIALIZATION ====================

async function init() {
  // Query active tab from the current popup window
  let activeTabId = null;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      activeTabId = tab.id;
    }
  } catch {}

  // Fallback if currentWindow is detached/popup
  if (!activeTabId) {
    try {
      const [focusedTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (focusedTab?.id) {
        activeTabId = focusedTab.id;
      }
    } catch {}
  }

  // Query active tab info from background
  const res = await chrome.runtime.sendMessage({ action: 'GET_TAB_INFO', tabId: activeTabId });
  if (!res?.success) {
    DOM.systemPageAlert.classList.remove('hidden');
    return;
  }

  state.tabId = res.tabId;
  state.url = res.url;
  state.urlInfo = res.urlInfo;
  state.isApplicable = res.isApplicable;
  state.isActive = res.isActive;
  state.zoomFactor = res.zoomFactor || 1.0;
  state.savedZoom = res.savedZoom;
  state.settings = res.settings;

  // Language setup
  const chosenLang = state.settings.language || detectBrowserLanguage();
  renderTranslations(chosenLang);

  // Global toggle
  DOM.globalEnableToggle.checked = state.settings.enabled;

  // Domain badge (displays hostname and path if present)
  if (state.urlInfo) {
    const displayPath = state.urlInfo.pathname && state.urlInfo.pathname !== '/' ? state.urlInfo.pathname : '';
    DOM.domainBadge.textContent = `${state.urlInfo.hostname}${displayPath}`;
    DOM.domainBadge.title = state.urlInfo.cleanUrl;
    DOM.currentSiteText.textContent = state.urlInfo.hostname;
    DOM.systemPageAlert.classList.add('hidden');
  } else {
    DOM.domainBadge.textContent = 'Chrome System Page';
    DOM.systemPageAlert.classList.remove('hidden');
  }

  // Settings values (use effective auto-save mode)
  DOM.listModeSelect.value = state.settings.listMode;
  DOM.autoSaveSelect.value = res.effectiveAutoSave || 'off';
  DOM.showBadgeToggle.checked = state.settings.showBadge !== false;

  // Step size with accurate float matching
  selectDropdownByFloat(DOM.stepSizeSelect, state.settings.stepSize || 0.10);

  // Render sub-views
  updateZoomDisplay(state.zoomFactor);
  updatePersistenceUI();
  renderSitesList();
  renderShortcutsUI();
  updateCurrentSiteButton();

  setupEventListeners();
}

// ==================== SHORTCUT RECORDER ====================

function stopShortcutRecording() {
  if (activeRecording) {
    if (activeRecording.cleanup) activeRecording.cleanup();
    activeRecording.btn.classList.remove('recording');
    activeRecording = null;
    renderShortcutsUI();
  }
}

function extractPressedKey(e) {
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return null;
  if (e.key === ' ') return 'Space';
  if (e.key === '+') return '+';
  if (e.key === '-') return '-';
  if (e.key.startsWith('Arrow')) return e.key.slice(5);
  return e.key.length === 1 ? e.key.toUpperCase() : e.key;
}

function startShortcutRecording(shortcutKey, btn) {
  // If already recording this one, cancel it
  if (activeRecording && activeRecording.shortcutKey === shortcutKey) {
    stopShortcutRecording();
    return;
  }

  // Stop any other active recording
  stopShortcutRecording();

  btn.classList.add('recording');
  btn.textContent = t(state.activeLang, 'pressKeys');

  let recordedCombo = null;

  const onKeyDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Escape') {
      stopShortcutRecording();
      return;
    }

    const parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Cmd');

    const mainKey = extractPressedKey(e);
    if (mainKey) {
      parts.push(mainKey);
    }

    if (parts.length > 0) {
      recordedCombo = parts.join(' + ');
      btn.textContent = recordedCombo;
    }
  };

  const onKeyUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Confirm when keys stop being pressed and we have a valid key combination
    if (recordedCombo && !['Ctrl', 'Alt', 'Shift', 'Cmd'].includes(recordedCombo)) {
      const finalCombo = recordedCombo;
      state.settings.shortcuts[shortcutKey] = finalCombo;

      chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings }, () => {
        btn.textContent = finalCombo;
        stopShortcutRecording();
      });
    }
  };

  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('keyup', onKeyUp, true);

  const cleanup = () => {
    window.removeEventListener('keydown', onKeyDown, true);
    window.removeEventListener('keyup', onKeyUp, true);
  };

  activeRecording = { shortcutKey, btn, cleanup };
}

// Clean domain input helper (SonarQube S8786 compliant - no backtracking)
function cleanDomainInput(raw) {
  let clean = raw.trim().toLowerCase();
  if (clean.startsWith('http://')) {
    clean = clean.slice(7);
  } else if (clean.startsWith('https://')) {
    clean = clean.slice(8);
  }
  const slashIdx = clean.indexOf('/');
  if (slashIdx !== -1) {
    clean = clean.slice(0, slashIdx);
  }
  return clean;
}

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
  // Tab Switching
  DOM.navTabs.forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      stopShortcutRecording();

      DOM.navTabs.forEach(b => b.classList.remove('active'));
      DOM.tabContents.forEach(c => c.classList.remove('active'));

      tabBtn.classList.add('active');
      const targetId = tabBtn.dataset.tab;
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // Settings Language Switch
  DOM.settingsLangSelect.addEventListener('change', async (e) => {
    const newLang = e.target.value;
    state.settings.language = newLang;
    await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });
    renderTranslations(newLang);
  });

  // Global Enable Toggle
  DOM.globalEnableToggle.addEventListener('change', async (e) => {
    state.settings.enabled = e.target.checked;
    await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });
  });

  // Zoom In / Out Buttons
  DOM.btnZoomIn.addEventListener('click', async () => {
    const res = await chrome.runtime.sendMessage({ action: 'ADJUST_ZOOM', tabId: state.tabId, delta: 1 });
    if (res?.zoomFactor) {
      if (res.savedZoom !== undefined) state.savedZoom = res.savedZoom;
      updatePersistenceUI();
      updateZoomDisplay(res.zoomFactor);
    }
  });

  DOM.btnZoomOut.addEventListener('click', async () => {
    const res = await chrome.runtime.sendMessage({ action: 'ADJUST_ZOOM', tabId: state.tabId, delta: -1 });
    if (res?.zoomFactor) {
      if (res.savedZoom !== undefined) state.savedZoom = res.savedZoom;
      updatePersistenceUI();
      updateZoomDisplay(res.zoomFactor);
    }
  });

  // Inline Editable Zoom Percentage Display
  const startEditingZoom = () => {
    DOM.zoomPercentageDisplay.classList.add('hidden');
    DOM.zoomPercentageInput.classList.remove('hidden');
    const currentInt = Math.round(state.zoomFactor * 100);
    DOM.zoomPercentageInput.value = String(currentInt);
    DOM.zoomPercentageInput.focus();
    DOM.zoomPercentageInput.select();
  };

  const commitZoomInput = async () => {
    if (DOM.zoomPercentageInput.classList.contains('hidden')) return;

    const raw = DOM.zoomPercentageInput.value.replace(/\D/g, '').trim();
    let num = Number.parseInt(raw, 10);

    if (Number.isNaN(num) || raw === '') {
      num = Math.round(state.zoomFactor * 100);
    } else {
      // Clamping limits (25% to 500%)
      if (num < 25) num = 25;
      if (num > 500) num = 500;
    }

    DOM.zoomPercentageInput.classList.add('hidden');
    DOM.zoomPercentageDisplay.classList.remove('hidden');

    const targetZoom = num / 100;
    const res = await chrome.runtime.sendMessage({
      action: 'SET_ZOOM',
      tabId: state.tabId,
      zoomFactor: targetZoom
    });

    if (res?.zoomFactor) {
      if (res.savedZoom !== undefined) state.savedZoom = res.savedZoom;
      updatePersistenceUI();
      updateZoomDisplay(res.zoomFactor);
    }
  };

  const cancelZoomInput = () => {
    DOM.zoomPercentageInput.classList.add('hidden');
    DOM.zoomPercentageDisplay.classList.remove('hidden');
    DOM.zoomPercentageDisplay.textContent = `${Math.round(state.zoomFactor * 100)}%`;
  };

  DOM.zoomPercentageDisplay.addEventListener('click', startEditingZoom);

  DOM.zoomPercentageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitZoomInput();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelZoomInput();
    }
  });

  DOM.zoomPercentageInput.addEventListener('blur', () => {
    commitZoomInput();
  });

  DOM.zoomPercentageInput.addEventListener('input', (e) => {
    // Only allow whole positive integers
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  // User interaction guards (prevents external tabs.onZoomChange echoes from interrupting gestures)
  let isUserInteracting = false;

  const markInteracting = () => {
    isUserInteracting = true;
  };

  const unmarkInteracting = () => {
    setTimeout(() => {
      isUserInteracting = false;
    }, 150);
  };

  // Mouse Wheel Zoom over Percentage Display / Container
  let wheelAccumulator = 0;
  let wheelResetTimer = null;
  let wheelDebounceTimer = null;
  let targetWheelZoom = null;

  const calculateWheelDirection = (e) => {
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 33;
    else if (e.deltaMode === 2) delta *= 100;

    if (Math.abs(delta) >= 50) {
      wheelAccumulator = 0;
      return delta < 0 ? 1 : -1;
    }

    wheelAccumulator += delta;
    if (wheelResetTimer) {
      clearTimeout(wheelResetTimer);
    }
    wheelResetTimer = setTimeout(() => {
      wheelAccumulator = 0;
    }, 200);

    if (Math.abs(wheelAccumulator) >= 50) {
      const dir = wheelAccumulator < 0 ? 1 : -1;
      wheelAccumulator = 0;
      return dir;
    }
    return 0;
  };

  const scheduleWheelZoomCommit = () => {
    if (wheelDebounceTimer) {
      clearTimeout(wheelDebounceTimer);
    }

    wheelDebounceTimer = setTimeout(async () => {
      wheelDebounceTimer = null;
      const zoomToApply = targetWheelZoom;
      targetWheelZoom = null;

      if (zoomToApply !== null && state.tabId) {
        const res = await chrome.runtime.sendMessage({
          action: 'SET_ZOOM',
          tabId: state.tabId,
          zoomFactor: zoomToApply
        });
        if (res?.zoomFactor) {
          state.zoomFactor = res.zoomFactor;
          if (res.savedZoom !== undefined) state.savedZoom = res.savedZoom;
          updatePersistenceUI();
          updateZoomDisplay(res.zoomFactor);
        }
      }

      unmarkInteracting();
    }, 40);
  };

  DOM.zoomPercentageContainer.addEventListener('wheel', (e) => {
    e.preventDefault();

    if (!state.tabId || !state.isApplicable) return;

    if (!DOM.zoomPercentageInput.classList.contains('hidden')) {
      DOM.zoomPercentageInput.classList.add('hidden');
      DOM.zoomPercentageDisplay.classList.remove('hidden');
    }

    const direction = calculateWheelDirection(e);
    if (direction === 0) return;

    markInteracting();

    const stepSize = state.settings?.stepSize || 0.10;
    const currentBase = targetWheelZoom !== null ? targetWheelZoom : state.zoomFactor;
    let nextZoom = Math.round((currentBase + (direction * stepSize)) * 100) / 100;
    nextZoom = Math.min(5.0, Math.max(0.25, nextZoom));

    if (Math.abs(nextZoom - currentBase) < 0.001) return;

    targetWheelZoom = nextZoom;
    state.zoomFactor = nextZoom;

    updateZoomDisplay(nextZoom);
    scheduleWheelZoomCommit();
  }, { passive: false });

  // Zoom Slider - Live Real-Time Dragging
  let sliderRaf = null;
  let targetSliderZoom = null;

  DOM.zoomSlider.addEventListener('pointerdown', markInteracting);
  DOM.zoomSlider.addEventListener('mousedown', markInteracting);
  DOM.zoomSlider.addEventListener('touchstart', markInteracting, { passive: true });
  DOM.zoomSlider.addEventListener('pointerup', unmarkInteracting);
  DOM.zoomSlider.addEventListener('mouseup', unmarkInteracting);
  DOM.zoomSlider.addEventListener('touchend', unmarkInteracting);

  DOM.zoomPercentageInput.addEventListener('focus', markInteracting);
  DOM.zoomPercentageInput.addEventListener('blur', unmarkInteracting);

  DOM.zoomSlider.addEventListener('input', (e) => {
    isUserInteracting = true;
    const val = Number.parseInt(e.target.value, 10);
    DOM.zoomPercentageDisplay.textContent = `${val}%`;
    targetSliderZoom = val / 100;

    if (!sliderRaf) {
      sliderRaf = requestAnimationFrame(async () => {
        sliderRaf = null;
        if (targetSliderZoom !== null) {
          const zoomToApply = targetSliderZoom;
          const res = await chrome.runtime.sendMessage({
            action: 'SET_ZOOM',
            tabId: state.tabId,
            zoomFactor: zoomToApply
          });
          if (res?.zoomFactor) {
            state.zoomFactor = res.zoomFactor;
            if (res.savedZoom !== undefined) state.savedZoom = res.savedZoom;
            updatePersistenceUI();

            // Update chip highlights in real-time
            DOM.presetChips.forEach(chip => {
              const chipVal = Number.parseFloat(chip.dataset.preset);
              if (Math.abs(chipVal - state.zoomFactor) < 0.01) {
                chip.classList.add('active');
              } else {
                chip.classList.remove('active');
              }
            });
          }
        }
      });
    }
  });

  DOM.zoomSlider.addEventListener('change', async (e) => {
    unmarkInteracting();
    const val = Number.parseInt(e.target.value, 10) / 100;
    const res = await chrome.runtime.sendMessage({ action: 'SET_ZOOM', tabId: state.tabId, zoomFactor: val });
    if (res?.zoomFactor) {
      if (res.savedZoom !== undefined) state.savedZoom = res.savedZoom;
      updatePersistenceUI();
      updateZoomDisplay(res.zoomFactor);
    }
  });

  // Reset Zoom
  DOM.btnResetZoom.addEventListener('click', async () => {
    const res = await chrome.runtime.sendMessage({ action: 'RESET_ZOOM', tabId: state.tabId });
    if (res?.zoomFactor) {
      if (res.savedZoom !== undefined) state.savedZoom = res.savedZoom;
      updatePersistenceUI();
      updateZoomDisplay(res.zoomFactor);
    }
  });

  // Preset Chips
  DOM.presetChips.forEach(chip => {
    chip.addEventListener('click', async () => {
      const val = Number.parseFloat(chip.dataset.preset);
      const res = await chrome.runtime.sendMessage({ action: 'SET_ZOOM', tabId: state.tabId, zoomFactor: val });
      if (res?.zoomFactor) {
        if (res.savedZoom !== undefined) state.savedZoom = res.savedZoom;
        updatePersistenceUI();
        updateZoomDisplay(res.zoomFactor);
      }
    });
  });

  // Save for URL (Direct Link)
  DOM.btnSaveUrl.addEventListener('click', async () => {
    const res = await chrome.runtime.sendMessage({ action: 'SAVE_CURRENT_ZOOM', tabId: state.tabId });
    if (res?.success) {
      state.savedZoom = res.savedZoom !== undefined ? res.savedZoom : res.zoomFactor;
      updatePersistenceUI();
    }
  });

  // Delete Saved & Reset
  DOM.btnDeleteSaved.addEventListener('click', async () => {
    const res = await chrome.runtime.sendMessage({ action: 'DELETE_SAVED_ZOOM', tabId: state.tabId });
    if (res?.success) {
      state.savedZoom = null;
      updatePersistenceUI();
      updateZoomDisplay(1.0);
    }
  });

  // Auto-Save selector (Record Mode: off | url | always)
  DOM.autoSaveSelect.addEventListener('change', async (e) => {
    const selectedMode = e.target.value;
    if (state.urlInfo) {
      if (!state.settings.urlAutoSave) state.settings.urlAutoSave = {};

      if (selectedMode === 'url') {
        state.settings.urlAutoSave[state.urlInfo.cleanUrl] = 'on';
      } else if (selectedMode === 'always') {
        state.settings.autoSave = 'always';
        state.settings.urlAutoSave[state.urlInfo.cleanUrl] = 'on';
      } else {
        state.settings.urlAutoSave[state.urlInfo.cleanUrl] = 'off';
      }
    }
    await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });

    // If auto-save mode was turned on, persist current zoom immediately and sync!
    if (selectedMode !== 'off' && state.tabId) {
      const res = await chrome.runtime.sendMessage({
        action: 'SAVE_CURRENT_ZOOM',
        tabId: state.tabId
      });
      if (res?.success) {
        state.savedZoom = res.savedZoom;
      }
    }
    updatePersistenceUI();
  });

  // List Mode select
  DOM.listModeSelect.addEventListener('change', async (e) => {
    state.settings.listMode = e.target.value;
    await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });
    updateModeDesc();
    renderSitesList();
    updateCurrentSiteButton();
  });

  // Toggle Current Site in List
  DOM.btnToggleCurrentSite.addEventListener('click', async () => {
    const res = await chrome.runtime.sendMessage({ action: 'TOGGLE_SITE_RULE', tabId: state.tabId });
    if (res?.success) {
      const listName = state.settings.listMode === 'whitelist' ? 'whitelist' : 'blacklist';
      state.settings[listName] = res.list;
      renderSitesList();
      updateCurrentSiteButton();
    }
  });

  // Add Manual Site
  DOM.btnAddManualSite.addEventListener('click', async () => {
    const val = DOM.manualSiteInput.value;
    const cleanDomain = cleanDomainInput(val);
    if (!cleanDomain) return;

    const listName = state.settings.listMode === 'whitelist' ? 'whitelist' : 'blacklist';
    const list = state.settings[listName] || [];

    if (!list.includes(cleanDomain)) {
      list.push(cleanDomain);
      state.settings[listName] = list;
      await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });
      DOM.manualSiteInput.value = '';
      renderSitesList();
      updateCurrentSiteButton();
    }
  });

  // Clear site list
  DOM.btnClearSiteList.addEventListener('click', async () => {
    const listName = state.settings.listMode === 'whitelist' ? 'whitelist' : 'blacklist';
    state.settings[listName] = [];
    await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });
    renderSitesList();
    updateCurrentSiteButton();
  });

  // Multi-key Shortcut Recording with KeyUp Confirmation
  DOM.shortcutKeyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const shortcutKey = btn.dataset.shortcut;
      startShortcutRecording(shortcutKey, btn);
    });
  });

  // Reset Shortcuts to Default
  DOM.btnResetShortcuts.addEventListener('click', async () => {
    stopShortcutRecording();
    state.settings.shortcuts = {
      zoomIn: 'Ctrl + +',
      zoomOut: 'Ctrl + -',
      reset: 'Ctrl + 0',
      save: 'Alt + S',
      delete: 'Alt + D',
      wheelZoom: true,
      middleClickReset: true
    };
    await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });
    renderShortcutsUI();
  });

  // Step Size select
  DOM.stepSizeSelect.addEventListener('change', async (e) => {
    state.settings.stepSize = Number.parseFloat(e.target.value);
    await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });
  });

  // Badge toggle
  DOM.showBadgeToggle.addEventListener('change', async (e) => {
    state.settings.showBadge = e.target.checked;
    await chrome.runtime.sendMessage({ action: 'SAVE_SETTINGS', settings: state.settings });
  });

  // Listen for live external zoom changes on this tab
  chrome.tabs.onZoomChange.addListener((zoomChangeInfo) => {
    if (zoomChangeInfo.tabId === state.tabId) {
      state.zoomFactor = Math.round(zoomChangeInfo.newZoomFactor * 100) / 100;
      if (!isUserInteracting) {
        updateZoomDisplay(zoomChangeInfo.newZoomFactor);
      }
    }
  });

  // Listen for storage changes across tabs (e.g. global enable toggle switched in another tab)
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.settings) {
      const updated = changes.settings.newValue;
      if (updated) {
        state.settings = updated;
        if (DOM.globalEnableToggle) {
          DOM.globalEnableToggle.checked = updated.enabled;
        }
        updateCurrentSiteButton();
        updatePersistenceUI();
      }
    }
  });
}

// Start
document.addEventListener('DOMContentLoaded', init);
