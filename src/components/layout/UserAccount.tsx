'use client'

import { useEffect, useRef, useState } from 'react'

const menuItems = [
  { label: 'Account', message: 'Account' },
  { label: 'Log out', message: 'Log out' },
] as const

export default function UserAccount() {
  const [isOpen, setIsOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleMenuItemClick = (message: string) => {
    console.log(message)
    setIsOpen(false)
  }

  return (
    <div className="user-account-wrap" ref={wrapRef}>
      <button
        type="button"
        className="user-account"
        aria-label="User account"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        KR
      </button>

      {isOpen ? (
        <div className="user-account-menu" role="menu" aria-label="User account menu">
          {menuItems.map(({ label, message }) => (
            <button
              key={label}
              type="button"
              className="user-account-menu-item"
              role="menuitem"
              onClick={() => handleMenuItemClick(message)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
