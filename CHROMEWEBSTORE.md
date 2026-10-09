# Chrome Web Store Listing — Page Zoom Manager

**Last Updated:** 2026-10-08  
**Current Version:** 1.0.0  

---

## 1. Store Metadata

* **Extension Name:** Page Zoom Manager — Tab & Page Zoom Isolation
* **Short Description:** Control zoom levels independently per tab or page without affecting other open tabs. Includes customizable shortcuts.
* **Category:** Productivity / Accessibility
* **Primary Language:** Turkish / English (Supports 7 languages: TR, EN, DE, ES, FR, RU, JA)

---

## 2. Detailed Description

Tired of Chrome changing zoom levels across all open tabs of the same website? 

**Page Zoom Manager** gives you complete control over your browsing magnification. Zooming in one tab stays isolated to that tab only. You can also save custom zoom levels per specific page path or domain, customize keyboard and mouse shortcuts, and exclude websites using white/blacklists.

### Key Features
* 🔍 **Per-Tab Zoom Isolation:** Zooming in one tab never affects other tabs on the same website.
* 💾 **Smart Persistence (Optional & Stateless by Default):** Keep zoom temporary, or save it specifically for a page (ignoring query parameters) or an entire site.
* 🖱️ **Full Mouse & Keyboard Control:**
  * `Ctrl + Mouse Wheel`: Smooth custom zoom steps.
  * `Ctrl + Middle Click (Mouse 3)`: Instantly reset zoom to 100%.
  * `Ctrl + +` / `Ctrl + -`: Keyboard zoom override.
  * `Alt + S`: Quick-save zoom shortcut.
  * `Alt + D`: Reset and delete saved zoom shortcut.
* ⌨️ **Customizable Shortcuts:** Easily reassign keys directly from the popup interface.
* 🌐 **Whitelist & Blacklist Modes:** Choose whether the extension runs everywhere except specified domains, or only on allowed domains.
* 🏷️ **Icon Badge:** Displays the current active tab's zoom percentage directly on the extension icon.
* 🌍 **7 Languages:** Turkish, English, German, Spanish, French, Russian, and Japanese with automatic browser language detection.

---

## 3. Permissions Justification

| Permission | Plain-English Reviewer Justification |
| :--- | :--- |
| `tabs` | Required to detect the active tab's URL to apply page/site-specific zoom rules, and to configure per-tab zoom isolation via the browser zoom API. |
| `storage` | Required to save user preferences, such as custom shortcut keybindings, chosen zoom increment step size, whitelist/blacklist rules, and language selection. |
| `host_permissions` (`http://*/*`, `https://*/*`, `file://*/*`) | Required to inject shortcut listeners (Ctrl + Wheel, Ctrl + Mouse 3, and custom keybindings) directly into web pages so users can zoom seamlessly without opening the popup. |

---

## 4. Privacy & Data Use Disclosures

* **Data Collection:** None. This extension collects zero user data.
* **Network Requests:** None. All zoom calculations and configurations happen strictly on the user's local device.
* **Third-Party Services:** None.
