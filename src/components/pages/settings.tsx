'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/components/layout/ThemeProvider'

export default function Settings() {
  const { isDarkMode, setDarkMode } = useTheme()

  return (
    <>
      <h1>Settings</h1>
      <div className="flex items-center gap-2">
        <Checkbox
          id="dark-mode"
          checked={isDarkMode}
          onCheckedChange={setDarkMode}
        />
        <Label htmlFor="dark-mode">dark mode</Label>
      </div>
    </>
  )
}
