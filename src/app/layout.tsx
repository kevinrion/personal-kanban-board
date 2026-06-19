import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'
import '@/lib/fontawesome'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <Breadcrumb />
        {children}
      </body>
    </html>
  )
}
