import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal Email Hub - AI-Powered Email Summaries',
  description: 'Transform your inbox chaos into clear, actionable insights with AI-powered email summaries',
  keywords: ['email', 'summaries', 'AI', 'productivity', 'automation'],
  authors: [{ name: 'EmailAuto' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 