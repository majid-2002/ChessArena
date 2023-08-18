import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Play',
  description: 'Play Chess Online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-neutral-800'>{children}</body>
    </html>
  )
}
