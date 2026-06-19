import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <main>
      <h1>Kanban Board</h1>
      <p>Home</p>
      <Link
        href="/settings"
        className={cn(buttonVariants({ variant: 'default' }), 'mt-4')}
      >Settings</Link>
    </main>
  )
}
