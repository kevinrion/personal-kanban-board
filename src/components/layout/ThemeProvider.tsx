'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'theme-dark'

type ThemeContextValue = {
  isDarkMode: boolean
  setDarkMode: (value: boolean) => void
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredDarkMode() {
  if (typeof window === 'undefined') {
    return true
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (stored === null) {
    return true
  }

  return stored === 'true'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setIsDarkMode(readStoredDarkMode())
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    document.documentElement.classList.toggle('dark', isDarkMode)
    window.localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode))
  }, [hasHydrated, isDarkMode])

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        setDarkMode: setIsDarkMode,
        toggleDarkMode: () => setIsDarkMode((current) => !current),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
