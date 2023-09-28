import type { Metadata } from 'next'
import { NavBar } from '../components/NavBar'

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
      <NavBar/>
      {children}
    </div>
  )
}
