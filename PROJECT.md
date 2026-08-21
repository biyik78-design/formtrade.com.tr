# FORS Trade — Proje Dokümantasyonu

Bu doküman, `formtrade.com.tr` web sitesinin yapısını, sayfalarını ve son
yapılan geliştirmeleri özetler. Sitenin tüm kaynak kodu bu reponun kök
dizininde yer alır; herhangi bir build adımı (npm/webpack vb.) gerekmez,
doğrudan statik HTML/CSS/JS olarak GitHub Pages üzerinden yayınlanır.

## Repo / Yayın Bağlantıları

- **GitHub repo:** https://github.com/biyik78-design/formtrade.com.tr
- **Çalışma dalı (branch):** `claude/formtrade-website-redesign-jce5nd`
  https://github.com/biyik78-design/formtrade.com.tr/tree/claude/formtrade-website-redesign-jce5nd
- **Canlı site (GitHub Pages):** https://biyik78-design.github.io/formtrade.com.tr/

> Not: GitHub Pages, varsayılan olarak `main` dalını yayınlar. Bu branch'teki
> değişiklikleri canlı sitede görmek için branch'in `main`'e merge edilmesi
> (veya Pages ayarlarında bu branch'in seçilmesi) gerekir.

## Klasör Yapısı

```
formtrade.com.tr/
├── index.html                 Ana sayfa (hero, istatistikler, ürün carousel, spotlight, iletişim)
├── urunler.html                Ürün fotoğraf galerisi sayfası
├── hakkimizda.html             Kurumsal / Hakkımızda sayfası
├── hinge-3d-showcase.html      3D menteşe vitrin sayfası
├── ik.html                     İnsan Kaynakları sayfası
├── kvkk.html                   KVKK aydınlatma metni
├── ebulten.html                E-bülten sayfası
├── assets/
│   ├── css/
│   │   ├── style.css           Ana stil dosyası (tüm site genel tasarımı)
│   │   └── hinge-showcase.css  3D vitrin sayfasına özel stiller
│   ├── js/
│   │   ├── main.js             Ana sayfa etkileşimleri
│   │   ├── subpage.js          Alt sayfalar için ortak JS
│   │   └── hinge-showcase.js   3D vitrin sayfası JS
│   ├── img/
│   │   ├── fors-logo.png, favicon.svg
│   │   └── products/           Ürün fotoğrafları (gerçek menteşe çekimleri)
│   └── video/
│       └── hinge-hero.mp4      Hero bölümü arka plan videosu
└── README.md
```

## Sayfalar ve Öne Çıkan Özellikler

### `index.html` — Ana Sayfa
- **Hero bölümü:** Video arka plan + üzerine bindirilmiş **WebGL "Aura Field"
  shader arka planı** (`#aura-gl` canvas). FBM (fractal Brownian motion)
  gürültüsü ile dalgalanan, fareye/dokunmaya tepki veren, FORS turuncu
  (`#f2a23c`) vurgulu, teknolojik bir görsel doku katmanı.
- **İstatistikler bölümü:** Sağ kenarda dönen, D3.js tabanlı **Canvas2D dünya
  haritası (globe)** dekorasyonu (`#globeWrap`), düşük opaklıkla arka planda.
- **Ürün carousel (`#groups`):** 10 kartlık, otomatik kayan, CSS Houdini
  `@property` ile animasyonlu "yarış" kenarlıklı (racing border) ürün
  kartları. Altında `urunler.html` galerisine yönlendiren CTA butonu.
- **Spotlight bölümü:** Gerçek ürün fotoğraflarıyla galeri önizlemesi, "Tüm
  Ürünler" butonu `urunler.html`'e bağlı.
- **İletişim bölümü (`#contact`):** Form üstünde, daha belirgin/parlak
  (opaklık 0.88) ikinci bir **dünya haritası (globe)** animasyonu
  (`#cgWrap`) — "global erişim" temasını vurgulamak için "Bize Yazın"
  başlığının hemen üstüne eklendi.
- Çift dilli (TR/EN) içerik: `html.lang-en` sınıfı ile `.lang-tr` /
  `.lang-en` span'ları arasında geçiş yapılır.

### `urunler.html` — Ürün Fotoğraf Galerisi
- 5 gerçek ürün fotoğrafının (`assets/img/products/hinge-*.jpg`) sergilendiği
  bağımsız galeri sayfası.
- Üst navigasyonda Ana Sayfa / Hakkımızda / 3D Vitrin / İletişim linkleri.

### `hinge-3d-showcase.html`
- Menteşe ürününün 3D / interaktif vitrin sunumu (ayrı CSS/JS dosyalarıyla).

### `hakkimizda.html`, `ik.html`, `kvkk.html`, `ebulten.html`
- Kurumsal alt sayfalar, ortak `subpage.js` ile çalışır.

## Bu Oturumda Yapılan Son Değişiklikler

1. **Ürün galerisi eklendi:** `urunler.html` + 5 gerçek ürün fotoğrafı commit
   edildi.
2. **Navigasyon güncellendi:** `urunler.html` üst menüsüne sayfa linkleri
   eklendi; ana sayfadaki carousel ve spotlight bölümlerinden galeriye
   yönlendiren bağlantılar kuruldu; spotlight galerisi gerçek fotoğraflarla
   güncellendi.
3. **Aura Field WebGL arka planı:** Kullanıcının kendi tasarladığı
   `Aura_Field.html` demosundaki shader kodu, hero bölümüne özel olarak
   (tam sayfa yerine sadece hero alanına) entegre edildi.
4. **Globe Loader (dünya haritası) eklendi:** Kullanıcının kendi tasarladığı
   `Globe_Loader.html` demosu (D3.js + TopoJSON tabanlı dönen dünya haritası)
   FORS koyu temasına ve turuncu vurgu rengine uyarlanarak:
   - önce istatistikler bölümüne (düşük opaklık, dekoratif),
   - ardından kullanıcının isteği üzerine "Bize Yazın" / iletişim bölümüne
     (daha belirgin, yüksek opaklık) eklendi.

## Teknik Notlar

- **Build yok:** Saf HTML/CSS/JS; herhangi bir paket yöneticisi veya derleme
  adımı gerekmez.
- **Harici bağımlılıklar (CDN üzerinden, runtime'da yüklenir):**
  - `d3-array@3.2.4`, `d3-geo@3.1.0`, `topojson-client@3.1.0` (jsdelivr) —
    dünya haritası animasyonları için.
  - Dünya sınırları verisi: `unpkg.com/world-atlas@2.0.2/countries-110m.json`
- **WebGL shader'lar** `index.html` içinde `<script type="x-shader/x-vertex">`
  ve `type="x-shader/x-fragment">` etiketleriyle gömülü olarak bulunur.
- **Marka rengi:** `#f2a23c` (FORS turuncu).

## Tüm Kodu İndirme

Bu dokümanla birlikte projenin tamamının (tüm HTML/CSS/JS/görsel/video
dosyaları dahil) sıkıştırılmış bir `formtrade.com.tr.zip` arşivi ayrıca
gönderildi. Arşivi açtığınızda yukarıdaki klasör yapısının birebir aynısını
bulacaksınız — doğrudan bir web sunucusunda yayınlanabilir veya GitHub
reposuna karşılaştırma için kullanılabilir.
