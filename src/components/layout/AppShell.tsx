'use client'

import PageContent from '@/components/layout/PageContent'
import Sidebar from '@/components/layout/Sidebar'
import { useSidebar } from '@/components/layout/SidebarProvider'
import TopBar from '@/components/layout/TopBar'
import { cn } from '@/lib/utils'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useSidebar()

  return (
    <div className={cn('app', !sidebarOpen && 'app--sidebar-hidden')}>
      <TopBar />
      {sidebarOpen ? <Sidebar /> : null}
      <PageContent>{children}</PageContent>
    </div>
  )
}
