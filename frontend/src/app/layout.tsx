import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chess Clone',
  description: 'A chess clone made with React and Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-neutral-900">
      <body className={`max-w-screen-xl min-w-[75%] mx-auto bg-neutral-900 ${inter.className}`}>{children}</body>
    </html>
  )
}
