const TICKETS_STORAGE_KEY = 'kanban-tickets'

const VALID_COLUMNS = new Set([
  'ready',
  'in progress',
  'qa',
  'for release',
  'done',
])

export type StoredBoardTicket = {
  id: string
  title: string
  description: string
  tag: string
  assignee: string
  column: string
  notes: string
}

function isStoredBoardTicket(value: unknown): value is StoredBoardTicket {
  if (!value || typeof value !== 'object') {
    return false
  }

  const ticket = value as Record<string, unknown>

  return (
    typeof ticket.id === 'string' &&
    typeof ticket.title === 'string' &&
    typeof ticket.description === 'string' &&
    typeof ticket.tag === 'string' &&
    typeof ticket.assignee === 'string' &&
    typeof ticket.column === 'string' &&
    VALID_COLUMNS.has(ticket.column) &&
    typeof ticket.notes === 'string'
  )
}

export function loadTicketsFromStorage<T extends StoredBoardTicket>(
  fallback: T[],
): T[] {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(TICKETS_STORAGE_KEY)

    if (!raw) {
      return fallback
    }

    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return fallback
    }

    const tickets = parsed.filter(isStoredBoardTicket)

    return tickets.length > 0 ? (tickets as T[]) : fallback
  } catch {
    return fallback
  }
}

export function saveTicketsToStorage(tickets: StoredBoardTicket[]): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))
  } catch {
    // Ignore quota or privacy errors.
  }
}
