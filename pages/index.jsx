import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion'

/* ─── Motion presets ─────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

/* ─── Animated counter ───────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (inView) animate(count, target, { duration: 1.8, ease: [0.22, 1, 0.36, 1] })
  }, [inView])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

/* ─── Section reveal wrapper ─────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/* ─── SVG Icons ──────────────────────────────────────── */
const Ico = ({ d, children, size = 24, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {children}
  </svg>
)
const ArrowRight = () => <Ico size={18}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/></Ico>
const ArrowUpRight = () => <Ico size={18}><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></Ico>
const ChevronUp = () => <Ico size={18} strokeWidth="2"><polyline points="18 15 12 9 6 15"/></Ico>
const MenuIcon = () => <Ico size={20}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></Ico>
const CloseIcon = () => <Ico size={20}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ico>
const MailIcon = () => <Ico size={22}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></Ico>
const PhoneIcon = () => <Ico size={22}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></Ico>
const MapPin = () => <Ico size={22}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Ico>
const CheckIcon = () => <Ico size={16} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></Ico>

/* ─── HEADER ─────────────────────────────────────────── */
function Header({ lang, setLang, scrolled, mobileOpen, setMobileOpen, t }) {
  const nav = [
    { href: '#hero', tr: 'Ana Sayfa', en: 'Home' },
    { href: '#about', tr: 'Hakkımızda', en: 'About' },
    { href: '#products', tr: 'Ürünler', en: 'Products' },
    { href: '#contact', tr: 'İletişim', en: 'Contact' },
  ]

  return (
    <>
      <motion.header
        className={`header ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="container">
          <a href="#hero" className="logo">
            <span className="logo-word">
              FORM
              <small>{t('Tic. ve Sınai Ürünler', 'Commercial & Industrial')}</small>
            </span>
          </a>

          <nav className="nav-links">
            {nav.map((item) => (
              <a key={item.href} href={item.href}>{t(item.tr, item.en)}</a>
            ))}
          </nav>

          <div className="header-actions">
            <div className="lang-switch">
              {['tr', 'en'].map((l) => (
                <motion.button
                  key={l}
                  type="button"
                  className={lang === l ? 'active' : ''}
                  onClick={() => setLang(l)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                >
                  {l.toUpperCase()}
                </motion.button>
              ))}
            </div>
            <motion.button
              className="mobile-toggle"
              type="button"
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.92 }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease }}
          >
            {nav.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setMobileOpen(false)}
              >
                {t(item.tr, item.en)}
              </motion.a>
            ))}
            <div className="lang-switch mt-auto">
              {['tr', 'en'].map((l) => (
                <button
                  key={l}
                  type="button"
                  className={lang === l ? 'active' : ''}
                  onClick={() => { setLang(l); setMobileOpen(false) }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─── HERO ───────────────────────────────────────────── */
function Hero({ t, lang }) {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <motion.div
          className="orb orb-amber"
          animate={{ x: [0, 50, -20, 0], y: [0, -35, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="orb orb-violet"
          animate={{ x: [0, -40, 50, 0], y: [0, 30, -25, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="grid-overlay" />

      <div className="container">
        <motion.div
          className="hero-content"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="badge">
            <span className="dot" />
            {t("Türkiye'nin Lider Mobilya Donanımı İthalatçısı • 1977'den Beri",
               "Turkey's Leading Furniture Hardware Importer • Since 1977")}
          </motion.div>

          <motion.h1 variants={fadeUp}>
            {lang === 'tr'
              ? <>Mobilyaya Hareket Kazandıran <span className="gradient-text">Global Markalar</span></>
              : <><span className="gradient-text">Global Brands</span> That Bring Furniture to Life</>}
          </motion.h1>

          <motion.p variants={fadeUp} className="lead">
            {t(
              "FORS markamız ve Milwaukee gibi global partner markalarla, 49 yıllık tecrübemizle menteşe, gazlı piston ve profesyonel aksesuarları Türkiye'nin dört bir yanına tedarik ediyoruz.",
              "With 49 years of experience and global partner brands like Milwaukee alongside our own FORS line, we deliver hinges, gas lift pistons and professional accessories across Turkey."
            )}
          </motion.p>

          <motion.div variants={fadeUp} className="hero-actions">
            <motion.a href="#products" className="btn btn-primary"
              whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}>
              {t('Ürünleri Keşfet', 'Explore Products')} <ArrowRight />
            </motion.a>
            <motion.a href="#contact" className="btn btn-outline"
              whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}>
              {t('İletişim Kur', 'Get in Touch')} <ArrowUpRight />
            </motion.a>
          </motion.div>

          <motion.div variants={fadeUp} className="hero-chips">
            {[
              { num: '49+', label: t('Yıl Tecrübe', 'Years Experience') },
              { num: '50+', label: t('İhracat Ülkesi', 'Export Countries') },
              { num: '67+', label: t('Ürün Çeşidi', 'Product Range') },
            ].map((chip) => (
              <motion.div key={chip.label} className="chip"
                whileHover={{ y: -5, borderColor: 'rgba(240,158,40,0.35)' }}
                transition={{ duration: 0.22 }}>
                <strong>{chip.num}</strong>
                <span>{chip.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="scroll-cue">
        <span>{t('Aşağı Kaydır', 'Scroll')}</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}

/* ─── MARQUEE ────────────────────────────────────────── */
function MarqueeBand({ t }) {
  const text = t(
    '✦ TÜRKİYE\'NİN LİDER İTHALATÇISI ✦ 49 YILLIK TECRÜBE ✦ ISO 9001 KALİTE ✦ GLOBAL İHRACAT AĞI ✦ FORS & MILWAUKEE',
    '✦ TURKEY\'S LEADING IMPORTER ✦ 49 YEARS OF EXPERIENCE ✦ ISO 9001 QUALITY ✦ GLOBAL EXPORT NETWORK ✦ FORS & MILWAUKEE'
  )
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1].map((i) => (
          <div key={i} className="marquee-group">
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── STATS ──────────────────────────────────────────── */
function Stats({ t }) {
  const stats = [
    { target: 49, suffix: '+', label: t('Yıllık Tecrübe', 'Years of Experience') },
    { target: 50, suffix: '+', label: t('İhracat Ülkesi', 'Export Countries') },
    { target: 67, suffix: '+', label: t('Ürün Çeşidi', 'Product Range') },
    { target: 5, suffix: '', label: t('Kıtaya İhracat', 'Continents Reached') },
  ]
  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="stat-card">
              <div className="stat-num">
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── ABOUT ──────────────────────────────────────────── */
function About({ t }) {
  const features = [
    {
      icon: '🌍',
      title: t('Global Tedarik', 'Global Sourcing'),
      desc: t('Dünya\'nın önde gelen üreticilerinden doğrudan tedarik.',
               'Direct sourcing from the world\'s leading manufacturers.'),
    },
    {
      icon: '✅',
      title: t('Kalite Kontrolü', 'Quality Control'),
      desc: t('ISO 9001 sertifikalı kalite güvencesi her üründe.',
               'ISO 9001 certified quality assurance on every product.'),
    },
    {
      icon: '🚀',
      title: t('Hızlı Teslimat', 'Fast Delivery'),
      desc: t('Türkiye genelinde geniş dağıtım ağı ile hızlı teslimat.',
               'Fast delivery across Turkey with a wide distribution network.'),
    },
    {
      icon: '🛠',
      title: t('Teknik Destek', 'Technical Support'),
      desc: t('Uzman ekibimizle satış sonrası tam teknik destek.',
               'Full after-sales technical support from our expert team.'),
    },
  ]

  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal className="section-head center">
          <div className="badge"><span className="dot" />{t('Hakkımızda', 'About Us')}</div>
          <h2>{t("1977'den Beri Mobilya Endüstrisinin Güvenilir Çözüm Ortağı",
                  'A Trusted Solution Partner for the Furniture Industry Since 1977')}</h2>
          <p className="desc">
            {t(
              'Form Ticari ve Sınai Ürünler San. ve Dış Tic. A.Ş., FORS markası altında menteşe, gazlı piston, kapı hidroliği ve mobilya aksesuarlarını dünyanın öncü üreticilerinden tedarik ederek Türkiye pazarına sunup 50\'den fazla ülkeye ihraç ediyoruz.',
              'Form Ticari ve Sınai Ürünler San. ve Dış Tic. A.Ş. sources hinges, gas lift pistons, door dampers and furniture fittings from the world\'s leading manufacturers under the FORS brand, serving the Turkish market and exporting to 50+ countries.'
            )}
          </p>
        </Reveal>

        <div className="features-grid">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <motion.div
                className="feature-card"
                whileHover={{ y: -6, borderColor: 'rgba(240,158,40,0.25)' }}
                transition={{ duration: 0.25, ease }}
              >
                <span className="feature-icon">{f.icon}</span>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── PRODUCTS ───────────────────────────────────────── */
function Products({ t }) {
  const products = [
    {
      icon: '🔩',
      title: t('Soft-Close Menteşeler', 'Soft-Close Hinges'),
      desc: t('Yavaş kapanma sistemi ile güvenli ve sessiz mobilya menteşeleri.',
               'Safe and silent furniture hinges with soft-close mechanism.'),
      tag: 'FORS',
    },
    {
      icon: '⬆️',
      title: t('Gazlı Pistonlar', 'Gas Lift Pistons'),
      desc: t('Yüksek performanslı gazlı piston sistemleri, her boyut ve kapasite.',
               'High-performance gas lift piston systems in every size and capacity.'),
      tag: 'FORS',
    },
    {
      icon: '🚪',
      title: t('Kapı Durdurucuları', 'Door Dampers'),
      desc: t('Kapıları nazikçe durduran hidrolik damper çözümleri.',
               'Hydraulic damper solutions that gently stop doors.'),
      tag: 'FORS',
    },
    {
      icon: '🔧',
      title: t('Mobilya Aksesuarları', 'Furniture Fittings'),
      desc: t('Çekmece rayları, bağlantı elemanları ve mobilya yapı aksesuarları.',
               'Drawer runners, connectors and structural furniture accessories.'),
      tag: 'FORS',
    },
    {
      icon: '⚡',
      title: t('Milwaukee Güç Aletleri', 'Milwaukee Power Tools'),
      desc: t('Profesyonel kalite Milwaukee marka elektrikli el aletleri.',
               'Professional-grade Milwaukee brand power tools and accessories.'),
      tag: 'Milwaukee',
    },
    {
      icon: '📦',
      title: t('FORS Aksesuar Seti', 'FORS Accessory Sets'),
      desc: t('Eksiksiz mobilya donanımı paketleri, tek noktadan çözüm.',
               'Complete furniture hardware packages — one-stop solution.'),
      tag: 'FORS',
    },
  ]

  return (
    <section className="section section-soft" id="products">
      <div className="container">
        <Reveal className="section-head center">
          <div className="badge"><span className="dot" />{t('Ürünlerimiz', 'Our Products')}</div>
          <h2>{t('Menteşeden Bits Setlerine Eksiksiz Donanım Çözümleri',
                  'Complete Hardware Solutions, From Hinges to Bit Sets')}</h2>
          <p className="desc">
            {t('Kaliteli ve dayanıklı ürünlerimizle mobilya üreticilerinin ihtiyaçlarını karşılıyoruz.',
               'We meet the needs of furniture manufacturers with our quality and durable products.')}
          </p>
        </Reveal>

        <div className="products-grid">
          {products.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <motion.div
                className="product-card"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.28, ease }}
              >
                <div className="product-card-top">
                  <span className="product-icon">{p.icon}</span>
                  <span className={`product-tag tag-${p.tag.toLowerCase()}`}>{p.tag}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="product-card-footer">
                  <span className="product-link">
                    {t('Detaylar', 'Details')} <ArrowRight />
                  </span>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACT ────────────────────────────────────────── */
function Contact({ t }) {
  const info = [
    { icon: <MailIcon />, label: 'E-posta / Email', value: 'info@formtrade.com.tr' },
    { icon: <PhoneIcon />, label: t('Telefon', 'Phone'), value: '+90 (212) 000 00 00' },
    { icon: <MapPin />, label: t('Adres', 'Address'), value: t('İstanbul, Türkiye', 'Istanbul, Turkey') },
  ]

  return (
    <section className="section section-soft" id="contact">
      <div className="container">
        <Reveal className="section-head center">
          <div className="badge"><span className="dot" />{t('İletişim', 'Contact')}</div>
          <h2>{t('Sizden Haber Almak İstiyoruz', "We'd Love to Hear From You")}</h2>
          <p className="desc">
            {t('Ürünlerimiz, bayilik fırsatları veya teknik destek için bize ulaşın.',
               'Reach out to us for our products, dealership opportunities or technical support.')}
          </p>
        </Reveal>

        <div className="contact-layout">
          <div className="contact-info">
            {info.map((item) => (
              <Reveal key={item.label}>
                <motion.div
                  className="contact-card"
                  whileHover={{ y: -4, borderColor: 'rgba(240,158,40,0.3)' }}
                  transition={{ duration: 0.22 }}
                >
                  <span className="contact-icon">{item.icon}</span>
                  <div>
                    <p className="contact-label">{item.label}</p>
                    <p className="contact-value">{item.value}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal className="contact-form-wrap">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <label>
                  <span>{t('Ad Soyad', 'Full Name')}</span>
                  <input type="text" placeholder={t('Adınızı girin', 'Enter your name')} />
                </label>
                <label>
                  <span>{t('E-posta', 'Email')}</span>
                  <input type="email" placeholder={t('E-posta adresiniz', 'Your email address')} />
                </label>
              </div>
              <label>
                <span>{t('Mesaj', 'Message')}</span>
                <textarea rows="5" placeholder={t('Nasıl yardımcı olabiliriz?', 'How can we help you?')} />
              </label>
              <motion.button
                type="submit"
                className="btn btn-primary btn-block"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {t('Mesaj Gönder', 'Send Message')} <ArrowRight />
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── FOOTER ─────────────────────────────────────────── */
function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-word">
              FORM
              <small>{t('Tic. ve Sınai Ürünler', 'Commercial & Industrial')}</small>
            </span>
            <p>{t("1977'den beri mobilya endüstrisinin güvenilir çözüm ortağı.",
                   "Trusted solution partner for the furniture industry since 1977.")}</p>
          </div>
          <div className="footer-links">
            <p className="footer-head">{t('Hızlı Bağlantılar', 'Quick Links')}</p>
            <a href="#about">{t('Hakkımızda', 'About')}</a>
            <a href="#products">{t('Ürünler', 'Products')}</a>
            <a href="#contact">{t('İletişim', 'Contact')}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Form Ticari ve Sınai Ürünler San. ve Dış Tic. A.Ş.{' '}
            {t('Tüm hakları saklıdır.', 'All rights reserved.')}
          </p>
          <p className="footer-powered">
            {t('Framer Motion ile canlandırıldı', 'Animated with Framer Motion')} ✦ Claude Code
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── PAGE ───────────────────────────────────────────── */
export default function Home() {
  const [lang, setLang] = useState('tr')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('formtrade-lang')
    const browser = navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'tr'
    setLang(saved || browser)
  }, [])

  useEffect(() => {
    localStorage.setItem('formtrade-lang', lang)
  }, [lang])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      setShowTop(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const t = (tr, en) => lang === 'tr' ? tr : en

  return (
    <>
      <Head>
        <title>FORM | {t("Türkiye'nin Lider Mobilya Donanımı İthalatçısı", "Turkey's Leading Furniture Hardware Importer")} — FORS & Milwaukee</title>
        <meta name="description" content={t(
          "FORM Ticari ve Sınai Ürünler — Türkiye'nin lider mobilya donanımı ithalatçısı. 1977'den beri FORS markası ve Milwaukee ile menteşe, gazlı piston ve mobilya aksesuarları.",
          "FORM Commercial & Industrial Products — Turkey's leading furniture hardware importer. FORS brand and Milwaukee since 1977: hinges, gas pistons and furniture accessories."
        )} />
        <meta name="theme-color" content="#07090e" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header
        lang={lang} setLang={setLang}
        scrolled={scrolled}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
        t={t}
      />

      <main>
        <Hero t={t} lang={lang} />
        <MarqueeBand t={t} />
        <Stats t={t} />
        <About t={t} />
        <Products t={t} />
        <Contact t={t} />
      </main>

      <Footer t={t} />

      <AnimatePresence>
        {showTop && (
          <motion.button
            className="back-to-top"
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ChevronUp />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
