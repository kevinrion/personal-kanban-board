'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Crumb = {
  href: string
  label: string
}

function getBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: Crumb[] = [{ href: '/', label: 'home' }]

  let path = ''
  for (const segment of segments) {
    path += `/${segment}`
    crumbs.push({ href: path, label: segment })
  }

  return crumbs
}

export default function Breadcrumb() {
  const pathname = usePathname()
  const crumbs = getBreadcrumbs(pathname)

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb-list">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <li key={crumb.href} className="breadcrumb-item">
              {isLast ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <Link href={crumb.href}>{crumb.label}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
