'use client'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import Ticket from '@/components/board/ticket'
import TicketDetail from '@/components/board/ticket-detail'
import { Input } from '@/components/ui/input'
import { useScrollFadeEdges } from '@/hooks/use-scroll-fade-edges'
import { cn } from '@/lib/utils'

const columns = [
  'ready',
  'in progress',
  'qa',
  'for release',
  'done',
] as const

const ticketNotes = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

const dummyTickets = [
  {
    id: 'KB-101',
    title: 'Update login form validation',
    description: 'Add client-side checks for email format and password length.',
    tag: 'frontend',
    assignee: 'KR',
    column: 'ready',
    notes: ticketNotes,
  },
  {
    id: 'KB-102',
    title: 'Fix breadcrumb spacing',
    description: 'Reduce padding on smaller breakpoints.',
    tag: 'ui',
    assignee: 'AM',
    column: 'ready',
    notes: ticketNotes,
  },
  {
    id: 'KB-106',
    title: 'Add empty state for columns',
    description: 'Show a friendly message when a column has no tickets.',
    tag: 'board',
    assignee: 'JT',
    column: 'ready',
    notes: ticketNotes,
  },
  {
    id: 'KB-107',
    title: 'Review sidebar active styles',
    description: 'Confirm highlight state is visible in dark mode.',
    tag: 'ui',
    assignee: 'AM',
    column: 'ready',
    notes: ticketNotes,
  },
  {
    id: 'KB-108',
    title: 'Create ticket component',
    description: 'Build a reusable card for kanban items.',
    tag: 'frontend',
    assignee: 'KR',
    column: 'ready',
    notes: ticketNotes,
  },
  {
    id: 'KB-109',
    title: 'Add top bar search behaviour',
    description: 'Filter visible tickets when typing in the search field.',
    tag: 'feature',
    assignee: 'JT',
    column: 'ready',
    notes: ticketNotes,
  },
  {
    id: 'KB-110',
    title: 'Polish column headers',
    description: 'Align title casing and spacing across all columns.',
    tag: 'ui',
    assignee: 'AM',
    column: 'ready',
    notes: ticketNotes,
  },
  {
    id: 'KB-103',
    title: 'Wire up dark mode toggle',
    description: 'Connect settings checkbox to theme class on the document root.',
    tag: 'settings',
    assignee: 'KR',
    column: 'in progress',
    notes: ticketNotes,
  },
  {
    id: 'KB-104',
    title: 'Add drag and drop to columns',
    description: 'Allow tickets to move between board columns.',
    tag: 'board',
    assignee: 'JT',
    column: 'qa',
    notes: ticketNotes,
  },
  {
    id: 'KB-117',
    title: 'Test keyboard navigation',
    description: 'Verify focus order across sidebar, board, and settings.',
    tag: 'a11y',
    assignee: 'AM',
    column: 'qa',
    notes: ticketNotes,
  },
  {
    id: 'KB-118',
    title: 'Validate mobile layout',
    description: 'Check board behaviour on narrow viewports.',
    tag: 'qa',
    assignee: 'JT',
    column: 'qa',
    notes: ticketNotes,
  },
  {
    id: 'KB-105',
    title: 'Prepare release notes',
    description: 'Summarise changes for the first internal demo.',
    tag: 'docs',
    assignee: 'AM',
    column: 'for release',
    notes: ticketNotes,
  },
  {
    id: 'KB-123',
    title: 'Update README milestones',
    description: 'Record manual vs AI-assisted progress in the project log.',
    tag: 'docs',
    assignee: 'KR',
    column: 'for release',
    notes: ticketNotes,
  },
  {
    id: 'KB-124',
    title: 'Tag release commit',
    description: 'Mark the first board UI milestone in git history.',
    tag: 'devops',
    assignee: 'JT',
    column: 'done',
    notes: ticketNotes,
  },
] as const

const tags = [...new Set(dummyTickets.map((ticket) => ticket.tag))].sort()

type BoardTicket = (typeof dummyTickets)[number]

function ticketMatchesFilter(ticket: BoardTicket, filterText: string) {
  const query = filterText.trim().toLowerCase()

  if (!query) {
    return true
  }

  const searchableText = [
    ticket.id,
    ticket.title,
    ticket.description,
    ticket.tag,
    ticket.assignee,
    ticket.column,
    ticket.notes,
  ]
    .join(' ')
    .toLowerCase()

  return searchableText.includes(query)
}

export default function Board() {
  const [filterText, setFilterText] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isFilterInputFocused, setIsFilterInputFocused] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [columnsWidth, setColumnsWidth] = useState<number | null>(null)
  const boardScrollRef = useRef<HTMLDivElement>(null)
  const filterTagsRef = useRef<HTMLDivElement>(null)

  const tagScrollEdges = useScrollFadeEdges(filterTagsRef)

  const visibleTickets = useMemo(
    () =>
      dummyTickets.filter(
        (ticket) =>
          ticketMatchesFilter(ticket, filterText) &&
          (!selectedTag || ticket.tag === selectedTag),
      ),
    [filterText, selectedTag],
  )

  const selectedTicket = useMemo(
    () => dummyTickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [selectedTicketId],
  )

  const isBoardFilterActive = isFilterInputFocused || selectedTag !== null

  useLayoutEffect(() => {
    const boardScroll = boardScrollRef.current

    if (!boardScroll) {
      return
    }

    const updateColumnsWidth = () => {
      if (!selectedTicketId) {
        setColumnsWidth(boardScroll.clientWidth)
      }
    }

    updateColumnsWidth()

    const resizeObserver = new ResizeObserver(updateColumnsWidth)
    resizeObserver.observe(boardScroll)

    return () => resizeObserver.disconnect()
  }, [selectedTicketId])

  return (
    <div className="board-page">
      <div className="board-filter">
        <Input
          type="search"
          className="board-filter-input mr-3"
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
          onFocus={() => setIsFilterInputFocused(true)}
          onBlur={() => setIsFilterInputFocused(false)}
          placeholder="Filter tickets..."
          aria-label="Filter tickets"
        />
        <div
          className={cn(
            'board-filter-tags-wrap scroll-fade-edges',
            tagScrollEdges.left && 'scroll-fade-edges--overflow-left',
            tagScrollEdges.right && 'scroll-fade-edges--overflow-right',
          )}
        >
          <div className="board-filter-tags" ref={filterTagsRef}>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={cn(
                  'board-filter-tag-btn',
                  selectedTag === tag && 'board-filter-tag-btn-active',
                )}
                aria-pressed={selectedTag === tag}
                onClick={() =>
                  setSelectedTag((current) => (current === tag ? null : tag))
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="board-body">
        <div className="board-scroll-wrap">
          <div className="board-scroll" ref={boardScrollRef}>
            <div
              className={cn('board-columns', selectedTicket && 'board-columns--frozen')}
              style={
                selectedTicket && columnsWidth
                  ? { width: columnsWidth, minWidth: columnsWidth }
                  : undefined
              }
            >
              {columns.map((label) => {
                const columnTickets = visibleTickets.filter(
                  (ticket) => ticket.column === label
                )

                return (
                  <section
                    key={label}
                    className={cn(
                      'board-column',
                      isBoardFilterActive && 'board-column--filter-active',
                    )}
                  >
                    <h2 className="board-column-title">
                      <span>{label}</span>
                      <span className="board-column-count">{columnTickets.length}</span>
                    </h2>
                    <div className="board-column-tickets">
                      {columnTickets.map(({ column, notes, ...ticket }) => (
                        <Ticket
                          key={ticket.id}
                          {...ticket}
                          isSelected={selectedTicketId === ticket.id}
                          onSelect={() =>
                            setSelectedTicketId((current) =>
                              current === ticket.id ? null : ticket.id,
                            )
                          }
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </div>

        {selectedTicket ? (
          <TicketDetail
            ticket={selectedTicket}
            onClose={() => setSelectedTicketId(null)}
          />
        ) : null}
      </div>
    </div>
  )
}
