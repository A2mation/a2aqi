import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import NotFoundPage from '@/components/404page'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <NotFoundPage />
      </body>
    </html>
  )
}