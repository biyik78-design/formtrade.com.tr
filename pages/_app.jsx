import { Inter, Sora } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['600', '700', '800'],
})

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${sora.variable}`}>
      <Component {...pageProps} />
    </div>
  )
}
