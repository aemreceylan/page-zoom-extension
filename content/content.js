/**
 * Page Zoom Manager - Content Script
 * Intercepts Ctrl + Wheel, Ctrl + Mouse 3, keyboard zoom shortcuts,
 * and handles custom keybindings with visual toast feedback.
 */

(function () {
  'use strict';

  let currentSettings = {
    enabled: true,
    listMode: 'blacklist',
    blacklist: [],
    whitelist: [],
    stepSize: 0.10,
    language: 'tr',
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

  let isPageActive = true;
  let wheelThrottleTimer = null;
  let accumulatedWheelSteps = 0;

  // Lightweight dictionary for in-page toasts
  const TOAST_TRANSLATIONS = {
    tr: {
      reset: 'Zoom sıfırlandı: %100',
      savedUrl: 'Zoom bu adres için kaydedildi',
      savedPage: 'Zoom bu adres için kaydedildi',
      savedSite: 'Zoom bu adres için kaydedildi',
      deleted: 'Kayıtlı zoom silindi & sıfırlandı: %100',
      in: 'Yakınlaştırıldı',
      out: 'Uzaklaştırıldı'
    },
    en: {
      reset: 'Zoom reset: 100%',
      savedUrl: 'Zoom saved for this address',
      savedPage: 'Zoom saved for this address',
      savedSite: 'Zoom saved for this address',
      deleted: 'Saved zoom deleted & reset: 100%',
      in: 'Zoomed In',
      out: 'Zoomed Out'
    },
    de: {
      reset: 'Zoom zurückgesetzt: 100%',
      savedUrl: 'Zoom für diese Adresse gespeichert',
      savedPage: 'Zoom für diese Adresse gespeichert',
      savedSite: 'Zoom für diese Adresse gespeichert',
      deleted: 'Gespeicherter Zoom gelöscht: 100%',
      in: 'Vergrößert',
      out: 'Verkleinert'
    },
    es: {
      reset: 'Zoom restablecido: 100%',
      savedUrl: 'Zoom guardado para esta dirección',
      savedPage: 'Zoom guardado para esta dirección',
      savedSite: 'Zoom guardado para esta dirección',
      deleted: 'Zoom guardado eliminado: 100%',
      in: 'Acercado',
      out: 'Alejado'
    },
    fr: {
      reset: 'Zoom réinitialisé: 100%',
      savedUrl: 'Zoom enregistré pour cette adresse',
      savedPage: 'Zoom enregistré pour cette adresse',
      savedSite: 'Zoom enregistré pour cette adresse',
      deleted: 'Zoom enregistré supprimé: 100%',
      in: 'Agrandissement',
      out: 'Rétrécissement'
    },
    ru: {
      reset: 'Масштаб сброшен: 100%',
      savedUrl: 'Масштаб сохранен для этого адреса',
      savedPage: 'Масштаб сохранен для этого адреса',
      savedSite: 'Масштаб сохранен для этого адреса',
      deleted: 'Сохраненный масштаб удален: 100%',
      in: 'Приближено',
      out: 'Отдалено'
    },
    ja: {
      reset: 'ズームをリセットしました: 100%',
      savedUrl: 'このアドレス用にズームを保存しました',
      savedPage: 'このアドレス用にズームを保存しました',
      savedSite: 'このアドレス用にズームを保存しました',
      deleted: '保存を削除してリセットしました: 100%',
      in: '拡大',
      out: '縮小'
    }
  };

  function getToastString(key) {
    const lang = currentSettings.language || (navigator.language || 'en').split('-')[0];
    const dict = TOAST_TRANSLATIONS[lang] || TOAST_TRANSLATIONS['en'] || TOAST_TRANSLATIONS['tr'];
    return dict[key] || TOAST_TRANSLATIONS['en'][key] || key;
  }

  /**
   * Determine if the current site is active under current settings
   */
  function checkSiteActive() {
    if (!currentSettings.enabled) {
      isPageActive = false;
      const container = document.querySelector('.page-zoom-toast-container');
      if (container) container.remove();
      return;
    }
    const hostname = window.location.hostname.toLowerCase();
    const inList = (list) => {
      return (list || []).some(item => {
        const clean = item.trim().toLowerCase();
        return clean && (hostname === clean || hostname.endsWith(`.${clean}`));
      });
    };

    if (currentSettings.listMode === 'whitelist') {
      isPageActive = inList(currentSettings.whitelist);
    } else {
      isPageActive = !inList(currentSettings.blacklist);
    }
  }

  /**
   * Load settings from storage/background
   */
  function syncSettings() {
    try {
      chrome.runtime.sendMessage({ action: 'GET_SETTINGS' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.settings) return;
        currentSettings = { ...currentSettings, ...response.settings };
        checkSiteActive();
      });
    } catch {}
  }

  // Listen to storage changes to update without page reload
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.settings) {
      currentSettings = { ...currentSettings, ...changes.settings.newValue };
      checkSiteActive();
    }
  });

  /**
   * Display a sleek, non-intrusive floating toast notification
   */
  function showToast(text, badge) {
    let container = document.querySelector('.page-zoom-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'page-zoom-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'page-zoom-toast';

    const iconSvg = `
      <svg class="page-zoom-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
      </svg>
    `;

    toast.innerHTML = `
      ${iconSvg}
      <span>${text}</span>
      ${badge ? `<span class="page-zoom-toast-badge">${badge}</span>` : ''}
    `;

    container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 250);
    }, 1800);
  }

  /**
   * Helper to normalize keyboard events and match against shortcut strings
   * Example shortcut format: "Ctrl + +", "Alt + S", "Ctrl + Shift + S"
   */
  function matchesShortcut(e, shortcutStr) {
    if (!shortcutStr || typeof shortcutStr !== 'string') return false;

    const parts = shortcutStr.split('+').map(p => p.trim().toLowerCase());
    const wantsCtrl = parts.includes('ctrl') || parts.includes('control');
    const wantsAlt = parts.includes('alt');
    const wantsShift = parts.includes('shift');
    const wantsMeta = parts.includes('meta') || parts.includes('cmd');

    const hasCtrl = e.ctrlKey;
    const hasAlt = e.altKey;
    const hasShift = e.shiftKey;
    const hasMeta = e.metaKey;

    if (wantsCtrl !== hasCtrl || wantsAlt !== hasAlt || wantsShift !== hasShift || wantsMeta !== hasMeta) {
      return false;
    }

    // Identify main key
    const mainKeys = parts.filter(p => !['ctrl', 'control', 'alt', 'shift', 'meta', 'cmd'].includes(p));
    if (mainKeys.length === 0) return false;
    const targetKey = mainKeys[0];

    const currentKey = e.key.toLowerCase();

    // Map common symbols
    if (targetKey === '+' || targetKey === '=') {
      return currentKey === '+' || currentKey === '=';
    }
    if (targetKey === '-' || targetKey === '_') {
      return currentKey === '-' || currentKey === '_';
    }

    return currentKey === targetKey;
  }

  // ==================== EVENT INTERCEPTION ====================

  /**
   * 1. Mouse Wheel Zoom (Ctrl + Wheel)
   */
  window.addEventListener('wheel', (e) => {
    if (!isPageActive) return;

    // Check if Ctrl is held down
    if (e.ctrlKey) {
      if (currentSettings.shortcuts?.wheelZoom === false) return;

      // Prevent native browser page zoom completely!
      e.preventDefault();
      e.stopImmediatePropagation();

      const direction = e.deltaY < 0 ? 1 : -1;
      accumulatedWheelSteps += direction;

      if (!wheelThrottleTimer) {
        wheelThrottleTimer = setTimeout(() => {
          const delta = accumulatedWheelSteps;
          accumulatedWheelSteps = 0;
          wheelThrottleTimer = null;

          chrome.runtime.sendMessage({ action: 'ADJUST_ZOOM', delta }, (res) => {
            if (res && res.zoomFactor) {
              const pct = Math.round(res.zoomFactor * 100);
              const label = delta > 0 ? getToastString('in') : getToastString('out');
              showToast(label, `${pct}%`);
            }
          });
        }, 50);
      }
    }
  }, { passive: false, capture: true });

  /**
   * 2. Mouse 3 Click (Ctrl + Middle Click) -> Reset Zoom to 100%
   */
  function handleMiddleClick(e) {
    if (!isPageActive) return;

    if (e.button === 1 && e.ctrlKey) {
      if (currentSettings.shortcuts?.middleClickReset === false) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      chrome.runtime.sendMessage({ action: 'RESET_ZOOM' }, (res) => {
        if (res && res.success) {
          showToast(getToastString('reset'), '100%');
        }
      });
    }
  }

  window.addEventListener('mousedown', handleMiddleClick, { capture: true });
  window.addEventListener('auxclick', handleMiddleClick, { capture: true });

  /**
   * 3. Keyboard Shortcuts (Zoom In, Zoom Out, Reset, Save, Delete)
   */
  window.addEventListener('keydown', (e) => {
    if (!isPageActive) return;

    const shortcuts = currentSettings.shortcuts || {};

    // A. Zoom In (Default: Ctrl + + or custom)
    if (matchesShortcut(e, shortcuts.zoomIn || 'Ctrl + +') || (e.ctrlKey && (e.key === '+' || e.key === '='))) {
      e.preventDefault();
      e.stopImmediatePropagation();
      chrome.runtime.sendMessage({ action: 'ADJUST_ZOOM', delta: 1 }, (res) => {
        if (res && res.zoomFactor) {
          showToast(getToastString('in'), `${Math.round(res.zoomFactor * 100)}%`);
        }
      });
      return;
    }

    // B. Zoom Out (Default: Ctrl + - or custom)
    if (matchesShortcut(e, shortcuts.zoomOut || 'Ctrl + -') || (e.ctrlKey && (e.key === '-' || e.key === '_'))) {
      e.preventDefault();
      e.stopImmediatePropagation();
      chrome.runtime.sendMessage({ action: 'ADJUST_ZOOM', delta: -1 }, (res) => {
        if (res && res.zoomFactor) {
          showToast(getToastString('out'), `${Math.round(res.zoomFactor * 100)}%`);
        }
      });
      return;
    }

    // C. Reset Zoom (Default: Ctrl + 0 or custom)
    if (matchesShortcut(e, shortcuts.reset || 'Ctrl + 0') || (e.ctrlKey && e.key === '0')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      chrome.runtime.sendMessage({ action: 'RESET_ZOOM' }, (res) => {
        if (res && res.success) {
          showToast(getToastString('reset'), '100%');
        }
      });
      return;
    }

    // D. Save Current Zoom (Default: Alt + S or custom)
    if (matchesShortcut(e, shortcuts.save || 'Alt + S')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      chrome.runtime.sendMessage({ action: 'SAVE_CURRENT_ZOOM' }, (res) => {
        if (res && res.success) {
          const pct = Math.round(res.zoomFactor * 100);
          showToast(getToastString('savedUrl'), `${pct}%`);
        }
      });
      return;
    }

    // E. Delete Saved Zoom & Reset (Default: Alt + D or custom)
    if (matchesShortcut(e, shortcuts.delete || 'Alt + D')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      chrome.runtime.sendMessage({ action: 'DELETE_SAVED_ZOOM' }, (res) => {
        if (res && res.success) {
          showToast(getToastString('deleted'), '100%');
        }
      });
      return;
    }
  }, { capture: true });

  // Initial sync
  syncSettings();
})();
