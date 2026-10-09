/**
 * Page Zoom Extension - Multilingual Translations (i18n)
 * Easily extensible: To add a new language, simply add its language code and dictionary below.
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' }
];

export const translations = {
  tr: {
    appName: 'Sayfa Zoom Yöneticisi',
    appDesc: 'Sekme ve sayfa bazlı bağımsız yakınlaştırma',
    
    // Status
    statusActive: 'Eklenti Aktif',
    statusDisabled: 'Eklenti Pasif',
    tabIsolated: 'Bu sekme izole edildi',
    notApplicable: 'Bu sayfada kullanılamaz (Chrome iç sayfası)',

    // Tabs
    tabZoom: 'Yakınlaştırma',
    tabSites: 'Siteler',
    tabShortcuts: 'Kısayollar',
    tabSettings: 'Ayarlar',

    // Zoom Controls
    currentZoom: 'Mevcut Oran',
    zoomNumberHint: 'Tıklayarak değer girin veya fare tekerleğiyle değiştirin',
    zoomIn: 'Yakınlaştır',
    zoomOut: 'Uzaklaştır',
    zoomReset: 'Sıfırla (%100)',
    presets: 'Hızlı Seçim',
    stepSize: 'Adım Oranı',

    // Persistence
    saveSectionTitle: 'Kayıt ve Kalıcılık',
    statelessNotice: 'Kayıt modu kapalıyken zoom yalnızca bu sekmeyi etkiler (geçici).',
    savedForUrl: 'Bu Adres İçin Kayıtlı',
    savedForPage: 'Bu Adres İçin Kayıtlı',
    savedForSite: 'Bu Adres İçin Kayıtlı',
    noSavedZoom: 'Kayıtlı oran yok (geçici)',
    btnSaveUrl: 'Bu Adres İçin Kaydet',
    btnSavePage: 'Bu Adres İçin Kaydet',
    btnSaveSite: 'Bu Adres İçin Kaydet',
    btnDeleteSaved: 'Kaydı Sil & Sıfırla',
    autoSaveLabel: 'Kayıt Modu (Otomatik Kaydet)',
    autoSaveDesc: 'Açıkken yapılan zoomlar kaydedilir ve aynı adresteki sekmeler anlık eşitlenir',
    autoSaveOff: 'Kapalı (Geçici)',
    autoSaveUrl: 'Açık (Bu Adres İçin)',
    autoSaveAlways: 'Her Zaman Açık (Tüm Adresler)',
    autoSavePage: 'Açık (Bu Adres İçin)',
    autoSaveSite: 'Her Zaman Açık (Tüm Adresler)',

    // Site lists
    listMode: 'Çalışma Modu',
    blacklistMode: 'Kara Liste (Hariç Tutulanlar)',
    whitelistMode: 'Beyaz Liste (İzin Verilenler)',
    blacklistDesc: 'Tüm sitelerde aktiftir, listedekiler hariç.',
    whitelistDesc: 'Yalnızca listedeki sitelerde aktiftir.',
    currentSite: 'Mevcut Site',
    btnAddCurrent: 'Mevcut Siteyi Listeye Ekle',
    btnRemoveCurrent: 'Mevcut Siteyi Listeden Çıkar',
    addSitePlaceholder: 'Örn: example.com',
    btnAdd: 'Ekle',
    emptyList: 'Listede henüz site bulunmuyor.',
    clearList: 'Listeyi Temizle',

    // Shortcuts
    shortcutsTitle: 'Kısayol Yapılandırması',
    shortcutsHint: 'Değiştirmek istediğiniz kısayol kutucuğuna tıklayıp yeni tuşlara basın.',
    shortcutZoomIn: 'Yakınlaştır (Zoom In)',
    shortcutZoomOut: 'Uzaklaştır (Zoom Out)',
    shortcutReset: 'Sıfırla (%100)',
    shortcutSave: 'Zoom\'u Kaydet',
    shortcutDelete: 'Kaydı Sil & Sıfırla',
    shortcutMouse3Hint: 'Mouse 3: Tekerlek tıklaması / Tekerlek döndürme',
    pressKeys: 'Tuş kombinasyonuna basın...',
    btnResetShortcuts: 'Kısayolları Varsayılana Sıfırla',

    // Settings
    settingsTitle: 'Genel Ayarlar',
    languageLabel: 'Dil (Language)',
    stepLabel: 'Kısayol Adım Hassasiyeti',
    badgeLabel: 'İkon üzerinde zoom oranını göster (Badge)',
    badgeDesc: 'Eklenti ikonu üzerinde anlık sekme zoom yüzdesi görünür',

    // Toasts & Messages
    toastSavedUrl: 'Zoom bu adres için kaydedildi: %s',
    toastSavedPage: 'Zoom bu adres için kaydedildi: %s',
    toastSavedSite: 'Zoom bu adres için kaydedildi: %s',
    toastDeleted: 'Kayıtlı zoom silindi ve sıfırlandı: %100',
    toastReset: 'Zoom sıfırlandı: %100',
    toastDisabled: 'Eklenti bu sitede devre dışı',
    shortcutRecorded: 'Kısayol kaydedildi'
  },

  en: {
    appName: 'Page Zoom Manager',
    appDesc: 'Per-tab and per-page independent zoom',

    // Status
    statusActive: 'Extension Active',
    statusDisabled: 'Extension Disabled',
    tabIsolated: 'This tab is isolated',
    notApplicable: 'Cannot run on this page (Chrome system page)',

    // Tabs
    tabZoom: 'Zoom',
    tabSites: 'Sites',
    tabShortcuts: 'Shortcuts',
    tabSettings: 'Settings',

    // Zoom Controls
    currentZoom: 'Current Zoom',
    zoomNumberHint: 'Click to type percentage or scroll mouse wheel to adjust',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    zoomReset: 'Reset (100%)',
    presets: 'Quick Presets',
    stepSize: 'Step Size',

    // Persistence
    saveSectionTitle: 'Save & Persistence',
    statelessNotice: 'When save mode is off, zoom changes only affect this tab (temporary).',
    savedForUrl: 'Saved for this Address',
    savedForPage: 'Saved for this Address',
    savedForSite: 'Saved for this Address',
    noSavedZoom: 'No saved zoom (temporary)',
    btnSaveUrl: 'Save for This Address',
    btnSavePage: 'Save for This Address',
    btnSaveSite: 'Save for This Address',
    btnDeleteSaved: 'Delete Saved & Reset',
    autoSaveLabel: 'Save Mode (Auto-Save)',
    autoSaveDesc: 'When active, zoom changes are saved and tabs with the same address sync instantly',
    autoSaveOff: 'Off (Temporary)',
    autoSaveUrl: 'On (For this Address)',
    autoSaveAlways: 'Always On (All Addresses)',
    autoSavePage: 'On (For this Address)',
    autoSaveSite: 'Always On (All Addresses)',

    // Site lists
    listMode: 'Operation Mode',
    blacklistMode: 'Blacklist (Excluded)',
    whitelistMode: 'Whitelist (Allowed Only)',
    blacklistDesc: 'Active on all sites except listed ones.',
    whitelistDesc: 'Active only on listed sites.',
    currentSite: 'Current Site',
    btnAddCurrent: 'Add Current Site to List',
    btnRemoveCurrent: 'Remove Current Site from List',
    addSitePlaceholder: 'e.g. example.com',
    btnAdd: 'Add',
    emptyList: 'No sites in this list yet.',
    clearList: 'Clear List',

    // Shortcuts
    shortcutsTitle: 'Shortcut Configuration',
    shortcutsHint: 'Click on a shortcut box and press new keys to reassign.',
    shortcutZoomIn: 'Zoom In',
    shortcutZoomOut: 'Zoom Out',
    shortcutReset: 'Reset (100%)',
    shortcutSave: 'Save Current Zoom',
    shortcutDelete: 'Delete Saved & Reset',
    shortcutMouse3Hint: 'Mouse 3: Middle click / Wheel scroll',
    pressKeys: 'Press key combination...',
    btnResetShortcuts: 'Reset Shortcuts to Defaults',

    // Settings
    settingsTitle: 'General Settings',
    languageLabel: 'Language',
    stepLabel: 'Shortcut Step Increment',
    badgeLabel: 'Show zoom level badge on icon',
    badgeDesc: 'Displays active tab zoom percentage on extension badge',

    // Toasts & Messages
    toastSavedUrl: 'Zoom saved for this address: %s',
    toastSavedPage: 'Zoom saved for this address: %s',
    toastSavedSite: 'Zoom saved for this address: %s',
    toastDeleted: 'Saved zoom deleted & reset: 100%',
    toastReset: 'Zoom reset: 100%',
    toastDisabled: 'Extension disabled on this site',
    shortcutRecorded: 'Shortcut updated'
  },

  de: {
    appName: 'Seiten-Zoom-Manager',
    appDesc: 'Unabhängiger Zoom pro Tab und Seite',

    statusActive: 'Erweiterung Aktiv',
    statusDisabled: 'Erweiterung Deaktiviert',
    tabIsolated: 'Dieser Tab ist isoliert',
    notApplicable: 'Auf dieser internen Seite nicht verfügbar',

    tabZoom: 'Zoom',
    tabSites: 'Websites',
    tabShortcuts: 'Tastenkombinationen',
    tabSettings: 'Einstellungen',

    currentZoom: 'Aktueller Zoom',
    zoomNumberHint: 'Klicken zum Eingeben oder Mausrad zum Anpassen',
    zoomIn: 'Vergrößern',
    zoomOut: 'Verkleinern',
    zoomReset: 'Zurücksetzen (100%)',
    presets: 'Schnellauswahl',
    stepSize: 'Schrittgröße',

    saveSectionTitle: 'Speichern & Persistenz',
    statelessNotice: 'Wenn der Speichermodus aus ist, betrifft der Zoom nur diesen Tab (temporär).',
    savedForUrl: 'Für diese Adresse gespeichert',
    savedForPage: 'Für diese Adresse gespeichert',
    savedForSite: 'Für diese Adresse gespeichert',
    noSavedZoom: 'Kein gespeicherter Zoom (temporär)',
    btnSaveUrl: 'Für diese Adresse speichern',
    btnSavePage: 'Für diese Adresse speichern',
    btnSaveSite: 'Für diese Adresse speichern',
    btnDeleteSaved: 'Gespeicherten Zoom löschen & Reset',
    autoSaveLabel: 'Speichermodus (Auto-Save)',
    autoSaveDesc: 'Wenn aktiv, werden Zoom-Änderungen gespeichert und Tabs mit gleicher Adresse sofort synchronisiert',
    autoSaveOff: 'Aus (Temporär)',
    autoSaveUrl: 'An (Für diese Adresse)',
    autoSaveAlways: 'Immer An (Alle Adressen)',
    autoSavePage: 'An (Für diese Adresse)',
    autoSaveSite: 'Immer An (Alle Adressen)',

    listMode: 'Betriebsmodus',
    blacklistMode: 'Blacklist (Ausgenommen)',
    whitelistMode: 'Whitelist (Nur Erlaubt)',
    blacklistDesc: 'Aktiv auf allen Seiten außer aufgelisteten.',
    whitelistDesc: 'Nur auf aufgelisteten Seiten aktiv.',
    currentSite: 'Aktuelle Website',
    btnAddCurrent: 'Aktuelle Website zur Liste hinzufügen',
    btnRemoveCurrent: 'Aktuelle Website aus Liste entfernen',
    addSitePlaceholder: 'z.B. example.com',
    btnAdd: 'Hinzufügen',
    emptyList: 'Noch keine Websites in der Liste.',
    clearList: 'Liste leeren',

    shortcutsTitle: 'Tastenkürzel-Konfiguration',
    shortcutsHint: 'Auf ein Feld klicken und neue Tasten drücken.',
    shortcutZoomIn: 'Vergrößern',
    shortcutZoomOut: 'Verkleinern',
    shortcutReset: 'Zurücksetzen (100%)',
    shortcutSave: 'Aktuellen Zoom speichern',
    shortcutDelete: 'Gespeicherten löschen & Reset',
    shortcutMouse3Hint: 'Maus 3: Mittlere Maustaste / Scrollrad',
    pressKeys: 'Tastenkombination drücken...',
    btnResetShortcuts: 'Auf Standard zurücksetzen',

    settingsTitle: 'Allgemeine Einstellungen',
    languageLabel: 'Sprache (Language)',
    stepLabel: 'Zoom-Schrittweite',
    badgeLabel: 'Zoomstufe im Icon-Badge anzeigen',
    badgeDesc: 'Zeigt den aktuellen Zoom-Prozentsatz im Badge an',

    toastSavedUrl: 'Zoom für diese Adresse gespeichert: %s',
    toastSavedPage: 'Zoom für diese Adresse gespeichert: %s',
    toastSavedSite: 'Zoom für diese Adresse gespeichert: %s',
    toastDeleted: 'Gespeicherter Zoom gelöscht: 100%',
    toastReset: 'Zoom zurückgesetzt: 100%',
    toastDisabled: 'Erweiterung auf dieser Seite deaktiviert',
    shortcutRecorded: 'Tastenkürzel aktualisiert'
  },

  es: {
    appName: 'Administrador de Zoom',
    appDesc: 'Zoom independiente por pestaña y página',

    statusActive: 'Extensión Activa',
    statusDisabled: 'Extensión Desactivada',
    tabIsolated: 'Pestaña aislada',
    notApplicable: 'No disponible en esta página interna de Chrome',

    tabZoom: 'Zoom',
    tabSites: 'Sitios',
    tabShortcuts: 'Atajos',
    tabSettings: 'Ajustes',

    currentZoom: 'Zoom Actual',
    zoomNumberHint: 'Haga clic para escribir o use la rueda del ratón para ajustar',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    zoomReset: 'Restablecer (100%)',
    presets: 'Ajustes Rápidos',
    stepSize: 'Incremento',

    saveSectionTitle: 'Guardado y Persistencia',
    statelessNotice: 'Con el modo de guardado desactivado, el zoom solo afecta a esta pestaña (temporal).',
    savedForUrl: 'Guardado para esta dirección',
    savedForPage: 'Guardado para esta dirección',
    savedForSite: 'Guardado para esta dirección',
    noSavedZoom: 'Sin zoom guardado (temporal)',
    btnSaveUrl: 'Guardar para esta Dirección',
    btnSavePage: 'Guardar para esta Dirección',
    btnSaveSite: 'Guardar para esta Dirección',
    btnDeleteSaved: 'Eliminar Guardado y Restablecer',
    autoSaveLabel: 'Modo de Guardado (Auto-Save)',
    autoSaveDesc: 'Al estar activo, los cambios de zoom se guardan y las pestañas con la misma dirección se sincronizan al instante',
    autoSaveOff: 'Desactivado (Temporal)',
    autoSaveUrl: 'Activado (Para esta Dirección)',
    autoSaveAlways: 'Siempre Activado (Todas las Direcciones)',
    autoSavePage: 'Activado (Para esta Dirección)',
    autoSaveSite: 'Siempre Activado (Todas las Direcciones)',

    listMode: 'Modo de Operación',
    blacklistMode: 'Lista Negra (Excluidos)',
    whitelistMode: 'Lista Blanca (Solo Permitidos)',
    blacklistDesc: 'Activo en todos los sitios excepto los listados.',
    whitelistDesc: 'Activo solo en sitios listados.',
    currentSite: 'Sitio Actual',
    btnAddCurrent: 'Añadir Sitio Actual a la Lista',
    btnRemoveCurrent: 'Quitar Sitio Actual de la Lista',
    addSitePlaceholder: 'ej. example.com',
    btnAdd: 'Añadir',
    emptyList: 'No hay sitios en esta lista todavía.',
    clearList: 'Vaciar Lista',

    shortcutsTitle: 'Configuración de Atajos',
    shortcutsHint: 'Haga clic en un atajo y presione las nuevas teclas.',
    shortcutZoomIn: 'Acercar',
    shortcutZoomOut: 'Alejar',
    shortcutReset: 'Restablecer (100%)',
    shortcutSave: 'Guardar Zoom Actual',
    shortcutDelete: 'Eliminar Guardado y Restablecer',
    shortcutMouse3Hint: 'Ratón 3: Clic central / Rueda de desplazamiento',
    pressKeys: 'Presione combinación de teclas...',
    btnResetShortcuts: 'Restablecer Atajos por Defecto',

    settingsTitle: 'Ajustes Generales',
    languageLabel: 'Idioma (Language)',
    stepLabel: 'Incremento de Paso',
    badgeLabel: 'Mostrar insignia de porcentaje de zoom',
    badgeDesc: 'Muestra el porcentaje de zoom en el icono de la extensión',

    toastSavedUrl: 'Zoom guardado para esta dirección: %s',
    toastSavedPage: 'Zoom guardado para esta dirección: %s',
    toastSavedSite: 'Zoom guardado para esta dirección: %s',
    toastDeleted: 'Zoom guardado eliminado: 100%',
    toastReset: 'Zoom restablecido: 100%',
    toastDisabled: 'Extensión desactivada en este sitio',
    shortcutRecorded: 'Atajo actualizado'
  },

  fr: {
    appName: 'Gestionnaire de Zoom',
    appDesc: 'Zoom indépendant par onglet et par page',

    statusActive: 'Extension Activée',
    statusDisabled: 'Extension Désactivée',
    tabIsolated: 'Onglet isolé',
    notApplicable: 'Non disponible sur cette page interne',

    tabZoom: 'Zoom',
    tabSites: 'Sites',
    tabShortcuts: 'Raccourcis',
    tabSettings: 'Paramètres',

    currentZoom: 'Zoom Actuel',
    zoomNumberHint: 'Cliquez pour saisir ou faites défiler la molette pour ajuster',
    zoomIn: 'Agrandir',
    zoomOut: 'Rétrécir',
    zoomReset: 'Réinitialiser (100%)',
    presets: 'Préréglages',
    stepSize: 'Incrément',

    saveSectionTitle: 'Sauvegarde & Persistance',
    statelessNotice: 'Lorsque le mode d\'enregistrement est désactivé, le zoom n\'affecte que cet onglet (temporaire).',
    savedForUrl: 'Enregistré pour cette adresse',
    savedForPage: 'Enregistré pour cette adresse',
    savedForSite: 'Enregistré pour cette adresse',
    noSavedZoom: 'Aucun zoom enregistré (temporaire)',
    btnSaveUrl: 'Enregistrer pour cette adresse',
    btnSavePage: 'Enregistrer pour cette adresse',
    btnSaveSite: 'Enregistrer pour cette adresse',
    btnDeleteSaved: 'Supprimer l\'enregistrement & Réinitialiser',
    autoSaveLabel: 'Mode d\'Enregistrement (Auto-Save)',
    autoSaveDesc: 'Lorsqu\'il est actif, les zooms sont enregistrés et les onglets ayant la même adresse se synchronisent instantanément',
    autoSaveOff: 'Désactivé (Temporaire)',
    autoSaveUrl: 'Activé (Pour cette adresse)',
    autoSaveAlways: 'Toujours Activé (Toutes les adresses)',
    autoSavePage: 'Activé (Pour cette adresse)',
    autoSaveSite: 'Toujours Activé (Toutes les adresses)',

    listMode: 'Mode de Fonctionnement',
    blacklistMode: 'Liste Noire (Exclus)',
    whitelistMode: 'Liste Blanche (Autorisés)',
    blacklistDesc: 'Actif sur tous les sites sauf ceux listés.',
    whitelistDesc: 'Actif uniquement sur les sites listés.',
    currentSite: 'Site Actuel',
    btnAddCurrent: 'Ajouter le site actuel à la liste',
    btnRemoveCurrent: 'Retirer le site actuel de la liste',
    addSitePlaceholder: 'ex. example.com',
    btnAdd: 'Ajouter',
    emptyList: 'Aucun site dans cette liste pour le moment.',
    clearList: 'Effacer la liste',

    shortcutsTitle: 'Configuration des Raccourcis',
    shortcutsHint: 'Cliquez sur une case et appuyez sur de nouvelles touches.',
    shortcutZoomIn: 'Agrandir',
    shortcutZoomOut: 'Rétrécir',
    shortcutReset: 'Réinitialiser (100%)',
    shortcutSave: 'Enregistrer le zoom actuel',
    shortcutDelete: 'Supprimer l\'enregistrement & Réinitialiser',
    shortcutMouse3Hint: 'Souris 3: Clic molette / Défilement molette',
    pressKeys: 'Appuyez sur une combinaison...',
    btnResetShortcuts: 'Rétablir les raccourcis par défaut',

    settingsTitle: 'Paramètres Généraux',
    languageLabel: 'Langue (Language)',
    stepLabel: 'Incrément de Zoom',
    badgeLabel: 'Afficher le badge de zoom sur l\'icône',
    badgeDesc: 'Affiche le pourcentage de zoom de l\'onglet sur l\'icône',

    toastSavedUrl: 'Zoom enregistré pour cette adresse: %s',
    toastSavedPage: 'Zoom enregistré pour cette adresse: %s',
    toastSavedSite: 'Zoom enregistré pour cette adresse: %s',
    toastDeleted: 'Zoom enregistré supprimé: 100%',
    toastReset: 'Zoom réinitialisé: 100%',
    toastDisabled: 'Extension désactivée sur ce site',
    shortcutRecorded: 'Raccourci mis à jour'
  },

  ru: {
    appName: 'Менеджер Масштаба',
    appDesc: 'Независимый масштаб для каждой вкладки и страницы',

    statusActive: 'Расширение активно',
    statusDisabled: 'Расширение отключено',
    tabIsolated: 'Вкладка изолирована',
    notApplicable: 'Недоступно на этой системной странице Chrome',

    tabZoom: 'Масштаб',
    tabSites: 'Сайты',
    tabShortcuts: 'Горячие клавиши',
    tabSettings: 'Настройки',

    currentZoom: 'Текущий масштаб',
    zoomNumberHint: 'Нажмите для ввода или крутите колесико мыши для изменения',
    zoomIn: 'Приблизить',
    zoomOut: 'Отдалить',
    zoomReset: 'Сброс (100%)',
    presets: 'Быстрый выбор',
    stepSize: 'Шаг масштабирования',

    saveSectionTitle: 'Сохранение настроек',
    statelessNotice: 'При выключенном режиме сохранения масштаб влияет только на эту вкладку (временно).',
    savedForUrl: 'Сохранено для этого адреса',
    savedForPage: 'Сохранено для этого адреса',
    savedForSite: 'Сохранено для этого адреса',
    noSavedZoom: 'Нет сохраненного масштаба (временно)',
    btnSaveUrl: 'Сохранить для этого адреса',
    btnSavePage: 'Сохранить для этого адреса',
    btnSaveSite: 'Сохранить для этого адреса',
    btnDeleteSaved: 'Удалить сохраненное и сбросить',
    autoSaveLabel: 'Режим сохранения (Автосохранение)',
    autoSaveDesc: 'При включении масштаб сохраняется, а вкладки с одинаковым адресом синхронизируются мгновенно',
    autoSaveOff: 'Выкл (Временно)',
    autoSaveUrl: 'Вкл (Для этого адреса)',
    autoSaveAlways: 'Всегда вкл (Все адреса)',
    autoSavePage: 'Вкл (Для этого адреса)',
    autoSaveSite: 'Всегда вкл (Все адреса)',

    listMode: 'Режим работы',
    blacklistMode: 'Черный список (Исключения)',
    whitelistMode: 'Белый список (Только разрешенные)',
    blacklistDesc: 'Активно везде, кроме сайтов из списка.',
    whitelistDesc: 'Активно только на сайтах из списка.',
    currentSite: 'Текущий сайт',
    btnAddCurrent: 'Добавить текущий сайт в список',
    btnRemoveCurrent: 'Удалить текущий сайт из списка',
    addSitePlaceholder: 'например example.com',
    btnAdd: 'Добавить',
    emptyList: 'В этом списке пока нет сайтов.',
    clearList: 'Очистить список',

    shortcutsTitle: 'Настройка горячих клавиш',
    shortcutsHint: 'Нажмите на поле и введите новую комбинацию клавиш.',
    shortcutZoomIn: 'Приблизить',
    shortcutZoomOut: 'Отдалить',
    shortcutReset: 'Сброс (100%)',
    shortcutSave: 'Сохранить текущий масштаб',
    shortcutDelete: 'Удалить сохраненное и сбросить',
    shortcutMouse3Hint: 'Мышь 3: Нажатие колесика / Прокрутка колесика',
    pressKeys: 'Нажмите комбинацию клавиш...',
    btnResetShortcuts: 'Сбросить клавиши по умолчанию',

    settingsTitle: 'Основные настройки',
    languageLabel: 'Язык (Language)',
    stepLabel: 'Шаг изменения масштаба',
    badgeLabel: 'Показывать процент на значке',
    badgeDesc: 'Отображает текущий процент масштаба на значке расширения',

    toastSavedUrl: 'Масштаб сохранен для этого адреса: %s',
    toastSavedPage: 'Масштаб сохранен для этого адреса: %s',
    toastSavedSite: 'Масштаб сохранен для этого адреса: %s',
    toastDeleted: 'Сохраненный масштаб удален: 100%',
    toastReset: 'Масштаб сброшен: 100%',
    toastDisabled: 'Расширение отключено на этом сайте',
    shortcutRecorded: 'Комбинация обновлена'
  },

  ja: {
    appName: 'ページズームマネージャー',
    appDesc: 'タブ・ページごとの独立ズーム管理',

    statusActive: '拡張機能 有効',
    statusDisabled: '拡張機能 無効',
    tabIsolated: 'このタブは独立しています',
    notApplicable: 'このChrome内部ページでは利用できません',

    tabZoom: 'ズーム',
    tabSites: 'サイト設定',
    tabShortcuts: 'ショートカット',
    tabSettings: '一般設定',

    currentZoom: '現在の倍率',
    zoomNumberHint: 'クリックして数値を入力、またはマウスホイールで調整',
    zoomIn: '拡大',
    zoomOut: '縮小',
    zoomReset: 'リセット (100%)',
    presets: 'プリセット',
    stepSize: 'ステップ幅',

    saveSectionTitle: '保存と永続化',
    statelessNotice: '保存モードがオフの場合、ズームはこのタブにのみ影響します（一時的）。',
    savedForUrl: 'このアドレス用に保存済み',
    savedForPage: 'このアドレス用に保存済み',
    savedForSite: 'このアドレス用に保存済み',
    noSavedZoom: '保存された倍率なし（一時的）',
    btnSaveUrl: 'このアドレス用に保存',
    btnSavePage: 'このアドレス用に保存',
    btnSaveSite: 'このアドレス用に保存',
    btnDeleteSaved: '保存を削除してリセット',
    autoSaveLabel: '保存モード (自動保存)',
    autoSaveDesc: '有効時、変更が保存され同一アドレスのタブが即座に同期されます',
    autoSaveOff: 'オフ (一時的)',
    autoSaveUrl: 'オン (このアドレス用)',
    autoSaveAlways: '常にオン (すべてのアドレス)',
    autoSavePage: 'オン (このアドレス用)',
    autoSaveSite: '常にオン (すべてのアドレス)',

    listMode: '動作モード',
    blacklistMode: 'ブラックリスト (除外)',
    whitelistMode: 'ホワイトリスト (許可のみ)',
    blacklistDesc: 'リスト内のサイトを除き、全サイトで動作します。',
    whitelistDesc: 'リスト内のサイトでのみ動作します。',
    currentSite: '現在のサイト',
    btnAddCurrent: '現在のサイトをリストに追加',
    btnRemoveCurrent: '現在のサイトをリストから削除',
    addSitePlaceholder: '例: example.com',
    btnAdd: '追加',
    emptyList: 'リストに登録されたサイトはありません。',
    clearList: 'リストをクリア',

    shortcutsTitle: 'ショートカット設定',
    shortcutsHint: '枠をクリックして、新しいキーを押して設定してください。',
    shortcutZoomIn: '拡大',
    shortcutZoomOut: '縮小',
    shortcutReset: 'リセット (100%)',
    shortcutSave: '現在の倍率を保存',
    shortcutDelete: '保存を削除してリセット',
    shortcutMouse3Hint: 'マウス3: ホイールクリック / スクロール',
    pressKeys: 'キーの組み合わせを押してください...',
    btnResetShortcuts: 'デフォルトに戻す',

    settingsTitle: '設定',
    languageLabel: '言語 (Language)',
    stepLabel: 'ズームステップ刻み',
    badgeLabel: 'アイコンに倍率バッジを表示',
    badgeDesc: '拡張機能アイコン上に現在の倍率を表示します',

    toastSavedUrl: 'このアドレス用にズームを保存しました: %s',
    toastSavedPage: 'このアドレス用にズームを保存しました: %s',
    toastSavedSite: 'このアドレス用にズームを保存しました: %s',
    toastDeleted: '保存したズームを削除しました: 100%',
    toastReset: 'ズームをリセットしました: 100%',
    toastDisabled: 'このサイトでは無効化されています',
    shortcutRecorded: 'ショートカットを更新しました'
  }
};

/**
 * Detect user's preferred language from browser
 */
export function detectBrowserLanguage() {
  const browserLang = (navigator.language || 'en').toLowerCase().split('-')[0];
  if (translations[browserLang]) {
    return browserLang;
  }
  return 'en';
}

/**
 * Get localized string by key with optional string interpolation
 */
export function t(lang, key, ...args) {
  const activeLang = translations[lang] || translations['en'] || translations['tr'];
  let text = activeLang[key] || translations['en'][key] || translations['tr'][key] || key;
  if (args.length > 0) {
    args.forEach(arg => {
      text = text.replace('%s', arg);
    });
  }
  return text;
}
