import type { Metadata } from 'next'
import AppShell from '@/components/layout/AppShell'
import { SidebarProvider } from '@/components/layout/SidebarProvider'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
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
    <html lang="en" className={cn('font-sans', geist.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem('theme-dark');document.documentElement.classList.toggle('dark',d!=='false')}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <AppShell>{children}</AppShell>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
