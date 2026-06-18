import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kanban Board',
  description: 'A React knowledge refresher project',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
