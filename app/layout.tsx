import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Dinq.dev — Build anything. Ship fast.',
  description: 'AI-powered development platform for Ethiopian developers. Describe your app in English or Amharic and get production-ready code instantly.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Dinq.dev',
    description: 'AI dev platform for Ethiopian developers',
    url: 'https://dinq.dev',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
