import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Kanban Board</h1>
      <p>Home</p>
      <Link href="/settings" className="button">
        Settings
      </Link>
    </main>
  )
}
