'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-regular-svg-icons'
import {
  faQuestion,
} from '@fortawesome/free-solid-svg-icons'
import { Columns3, Settings } from 'lucide-react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { LucideIcon } from 'lucide-react'
import { useSidebar } from '@/components/layout/SidebarProvider'
import {
  SidebarCollapseIcon,
  SidebarExpandIcon,
} from '@/components/layout/sidebar-mode-icons'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon?: IconDefinition
  LucideIcon?: LucideIcon
}

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: faHouse },
  { href: '/board', label: 'Board', LucideIcon: Columns3 },
  { href: '/settings', label: 'Settings', LucideIcon: Settings },
]

const fillerNavLabels = [
  'Lorem',
  'Ipsum',
  'Dolor',
  'Amet',
  'Conset',
  'Adipisc',
  'Elit',
  'Tempor',
  'Incidid',
  'Labore',
  'Dolore',
  'Magna',
  'Aliqua',
  'Enim',
  'Veniam',
] as const

const fillerNavItems: NavItem[] = fillerNavLabels.map((label, index) => ({
  href: `/test-${index + 1}`,
  label,
  icon: faQuestion,
}))

const navItems = [...mainNavItems, ...fillerNavItems]

function SidebarNavIcon({ icon, LucideIcon }: Pick<NavItem, 'icon' | 'LucideIcon'>) {
  if (LucideIcon) {
    return <LucideIcon size={16} strokeWidth={1.75} aria-hidden />
  }

  return <FontAwesomeIcon icon={icon!} />
}

function isNavItemActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  if (href.startsWith('/test-')) {
    return pathname === href
  }

  return pathname.startsWith(href)
}

export default function Sidebar() {
  const pathname = usePathname()
  const { showLabels, toggleLabels } = useSidebar()

  return (
    <aside
      className={cn('sidebar', !showLabels && 'sidebar--icons-only')}
      aria-label="Main navigation"
    >
      <div className="sidebar-nav-scroll">
        <nav>
          <ul className="sidebar-nav">
            {navItems.map(({ href, label, icon, LucideIcon }) => {
              const isActive = isNavItemActive(pathname, href)

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={
                      isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
                    }
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={!showLabels ? label : undefined}
                    title={!showLabels ? label : undefined}
                  >
                    <SidebarNavIcon icon={icon} LucideIcon={LucideIcon} />
                    {showLabels ? <span>{label}</span> : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-mode-btn"
          aria-label={
            showLabels ? 'Show sidebar icons only' : 'Show sidebar icons and labels'
          }
          aria-pressed={!showLabels}
          onClick={toggleLabels}
        >
          {showLabels ? <SidebarCollapseIcon /> : <SidebarExpandIcon />}
        </button>
      </div>
    </aside>
  )
}
