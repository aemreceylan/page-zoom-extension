# Page Zoom Manager — Chrome Eklentisi (Manifest V3)

Chrome'da aynı sitede açılan tüm sekmelerin aynı zoom seviyesini paylaşması sorununu çözen, sekme ve sayfa bazlı bağımsız yakınlaştırma eklentisi.

---

## 🚀 Özellikler

1. **Sekme Bazlı İzolasyon (Per-Tab Zoom):**
   * Bir sekmede yapılan yakınlaştırma diğer sekmeleri kesinlikle etkilemez.
2. **Kısayol & Mouse 3 Override:**
   * `Ctrl + Fare Tekerleği`: Zoom in / Zoom out (Adım: Ayarlanabilir, varsayılan %10).
   * `Ctrl + Mouse 3 (Tekerlek Tıklaması)`: Zoom'u anında %100'e sıfırlar.
   * `Ctrl + +` / `Ctrl + -`: Klavye yakınlaştırma override.
   * `Ctrl + 0`: Klavye sıfırlama override.
   * `Alt + S`: Zoom'u kaydet kısayolu (özelleştirilebilir).
   * `Alt + D`: Kayıtlı zoom'u sil ve sıfırla kısayolu (özelleştirilebilir).
3. **Akıllı Kayıt ve Kalıcılık (Varsayılan: Stateless):**
   * Yapılan zoom ayarları varsayılan olarak geçicidir (o sekmeye özeldir, kapatılınca sıfırlanır).
   * İsteğe bağlı olarak **"Bu Sayfa İçin Kaydet"** veya **"Bu Site İçin Kaydet"** butonları / kısayolları ile kalıcı yapılabilir.
   * URL filtrelemede `?query=...` ve `#hash` parametreleri göz ardı edilir (temiz sayfa ve domain eşleşmesi).
4. **Kişiselleştirilebilir Kısayollar (Key Recorder):**
   * Arayüz üzerinden herhangi bir kısayol kutucuğuna tıklayıp istediğiniz tuşlara basarak kısayolları değiştirebilirsiniz.
5. **Site Yönetimi (Kara Liste & Beyaz Liste):**
   * **Kara Liste:** Her sitede aktif, listedekiler hariç.
   * **Beyaz Liste:** Sadece listedeki sitelerde aktif.
   * Mevcut siteyi tek tıkla listeye ekleme/çıkarma ve manuel alan adı ekleme.
6. **İkon Rozeti (Badge):**
   * Eklenti ikonu üzerinde anlık sekme zoom yüzdesi (`120%`, `100%`) rozet olarak görünür.
7. **Çok Dilli Sistem (i18n):**
   * 7 dil desteği: Türkçe (TR), English (EN), Deutsch (DE), Español (ES), Français (FR), Русский (RU), 日本語 (JA).
   * Tarayıcı dilini otomatik algılama ve açılır menüden anında dil değiştirebilme.
   * Kolayca yeni dil eklenebilen modüler yapı (`locales/translations.js`).

---

## 🛠️ Chrome'a Yükleme (Nasıl Kurulur?)

1. Google Chrome tarayıcınızı açın.
2. Adres çubuğuna `chrome://extensions` yazıp Enter'a basın.
3. Sağ üst köşedeki **"Geliştirici modu" (Developer mode)** anahtarını açın.
4. Sol üstte beliren **"Paketlenmemiş öge yükle" (Load unpacked)** butonuna tıklayın.
5. Bu klasörü seçin:
   ```text
   c:\Users\ahmet\Desktop\YAZILIM\web\page-zoom-extension
   ```
6. Eklenti anında yüklenecek ve araç çubuğunda görünecektir! (İğneleyerek sabitleyebilirsiniz).

---

## 📁 Proje Dosya Yapısı

```text
page-zoom-extension/
├── manifest.json              # Manifest V3 tanımları ve izinler
├── background/
│   └── service-worker.js      # Sekme izolasyonu, badge ve depolama motoru
├── content/
│   ├── content.js             # Mouse wheel, mouse 3, tuş dinleyici ve toast bildirimi
│   └── content.css            # Sayfa içi modern toast stilleri
├── popup/
│   ├── popup.html             # 4 sekmeli modern arayüz (Zoom, Siteler, Kısayollar, Ayarlar)
│   ├── popup.css              # Cam efektli (glassmorphism) modern tasarım
│   └── popup.js               # Arayüz denetleyicisi, key recorder ve i18n
├── locales/
│   └── translations.js        # 7 dilli genişletilebilir sözlük mimarisi
├── icons/                     # 16, 48, 128px PNG ikonları
├── CHROMEWEBSTORE.md          # Chrome Web Store mağaza dökümantasyonu
└── README.md                  # Kurulum ve kullanım kılavuzu
```
