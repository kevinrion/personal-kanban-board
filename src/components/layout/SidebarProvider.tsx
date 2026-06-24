'use client'

import { createContext, useContext, useState } from 'react'

type SidebarContextValue = {
  sidebarOpen: boolean
  toggleSidebar: () => void
  showLabels: boolean
  toggleLabels: () => void
  setShowLabels: (showLabels: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLabels, setShowLabels] = useState(true)

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar: () => setSidebarOpen((current) => !current),
        showLabels,
        toggleLabels: () => setShowLabels((current) => !current),
        setShowLabels,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }

  return context
}
