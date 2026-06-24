import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <div className="flex items-center gap-2">
        <Checkbox id="dark-mode" defaultChecked />
        <Label htmlFor="dark-mode">dark mode</Label>
      </div>
    </>
  )
}
