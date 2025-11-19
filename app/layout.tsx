import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Character Synthesis - Mix & Create Amazing Characters',
  description: 'Combine random parts to create unique characters! Free and premium gacha game with AI-generated characters.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-dashed border-slate-300 text-slate-600 text-sm font-semibold text-center py-3">
          고정 광고 영역
        </div>
        <div className="pt-20">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
