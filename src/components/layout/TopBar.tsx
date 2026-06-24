'use client'

import { Moon, Sun } from 'lucide-react'
import { useSidebar } from '@/components/layout/SidebarProvider'
import {
  SidebarClosedIcon,
  SidebarOpenIcon,
} from '@/components/layout/sidebar-toggle-icons'
import { useTheme } from '@/components/layout/ThemeProvider'
import UserAccount from '@/components/layout/UserAccount'
import { cn } from '@/lib/utils'

export default function TopBar() {
  const { sidebarOpen, toggleSidebar } = useSidebar()
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="topbar-square-btn"
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          aria-pressed={sidebarOpen}
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <SidebarOpenIcon /> : <SidebarClosedIcon />}
        </button>
        <button
          type="button"
          className={cn(
            'topbar-square-btn topbar-theme-btn',
            !isDarkMode && 'topbar-theme-btn--solid',
          )}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDarkMode}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? (
            <Sun size={16} strokeWidth={1.75} aria-hidden />
          ) : (
            <Moon size={16} strokeWidth={1.75} aria-hidden />
          )}
        </button>
      </div>

      <div className="topbar-right">
        <UserAccount />
      </div>
    </header>
  )
}
