import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Play',
  description: 'Play Chess Online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}){
  return (
    <div>
      {children}
    </div>
  )
}
