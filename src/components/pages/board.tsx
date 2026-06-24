'use client'

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
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

type ColumnLabel = (typeof columns)[number]

const ticketNotes = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

const initialTickets = [
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

type BoardTicket = {
  id: string
  title: string
  description: string
  tag: string
  assignee: string
  column: ColumnLabel
  notes: string
}

type DragState = {
  ticketId: string
  pointerId: number
  ticketElement: HTMLElement
  offsetX: number
  offsetY: number
  startX: number
  startY: number
  lastClientX: number
  lastClientY: number
  pointerY: number
  pointerHasMoved: boolean
  delayElapsed: boolean
  isActive: boolean
  delayTimerId: number
  clone: HTMLElement | null
}

const DRAG_ACTIVATION_DELAY_MS = 50

function getColumnAtPoint(x: number, y: number): ColumnLabel | null {
  const element = document.elementFromPoint(x, y)
  const columnElement = element?.closest<HTMLElement>('[data-column]')

  if (!columnElement?.dataset.column) {
    return null
  }

  const column = columnElement.dataset.column

  return columns.includes(column as ColumnLabel) ? (column as ColumnLabel) : null
}

function positionDragClone(
  clone: HTMLElement,
  clientX: number,
  clientY: number,
  offsetX: number,
  offsetY: number,
) {
  clone.style.left = `${clientX - offsetX}px`
  clone.style.top = `${clientY - offsetY}px`
}

function getColumnElement(column: ColumnLabel): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-column="${CSS.escape(column)}"]`)
}

function getColumnTicketElements(
  column: ColumnLabel,
  draggingTicketId: string,
): HTMLElement[] {
  const columnElement = getColumnElement(column)

  if (!columnElement) {
    return []
  }

  const ticketsContainer = columnElement.querySelector('.board-column-tickets')

  if (!ticketsContainer) {
    return []
  }

  return Array.from(
    ticketsContainer.querySelectorAll<HTMLElement>('[data-ticket-id]'),
  ).filter((ticketElement) => ticketElement.dataset.ticketId !== draggingTicketId)
}

function getVisibleInsertIndex(
  column: ColumnLabel,
  clientY: number,
  draggingTicketId: string,
): { insertIndex: number; visibleTicketIds: string[] } {
  const ticketElements = getColumnTicketElements(column, draggingTicketId)
  const visibleTicketIds = ticketElements
    .map((ticketElement) => ticketElement.dataset.ticketId)
    .filter((ticketId): ticketId is string => Boolean(ticketId))

  if (ticketElements.length === 0) {
    return { insertIndex: 0, visibleTicketIds }
  }

  for (let index = 0; index < ticketElements.length; index += 1) {
    const rect = ticketElements[index].getBoundingClientRect()
    const midpoint = rect.top + rect.height / 2

    if (clientY < midpoint) {
      return { insertIndex: index, visibleTicketIds }
    }
  }

  return { insertIndex: visibleTicketIds.length, visibleTicketIds }
}

function mapVisibleInsertToColumnIndex(
  tickets: BoardTicket[],
  targetColumn: ColumnLabel,
  ticketId: string,
  visibleInsertIndex: number,
  visibleTicketIds: string[],
): number {
  const columnTickets = tickets.filter(
    (ticket) => ticket.column === targetColumn && ticket.id !== ticketId,
  )

  if (columnTickets.length === 0 || visibleTicketIds.length === 0) {
    return 0
  }

  if (visibleInsertIndex <= 0) {
    const firstVisibleId = visibleTicketIds[0]
    const index = columnTickets.findIndex((ticket) => ticket.id === firstVisibleId)

    return index === -1 ? 0 : index
  }

  if (visibleInsertIndex >= visibleTicketIds.length) {
    const lastVisibleId = visibleTicketIds[visibleTicketIds.length - 1]
    const index = columnTickets.findIndex((ticket) => ticket.id === lastVisibleId)

    return index === -1 ? columnTickets.length : index + 1
  }

  const beforeId = visibleTicketIds[visibleInsertIndex]
  const index = columnTickets.findIndex((ticket) => ticket.id === beforeId)

  return index === -1 ? columnTickets.length : index
}

function insertTicketAtColumnIndex(
  tickets: BoardTicket[],
  ticketId: string,
  targetColumn: ColumnLabel,
  columnInsertIndex: number,
): BoardTicket[] {
  const draggedTicket = tickets.find((ticket) => ticket.id === ticketId)

  if (!draggedTicket) {
    return tickets
  }

  const withoutDragged = tickets.filter((ticket) => ticket.id !== ticketId)
  const updatedTicket = { ...draggedTicket, column: targetColumn }
  const columnTickets = withoutDragged.filter((ticket) => ticket.column === targetColumn)
  const clampedIndex = Math.max(0, Math.min(columnInsertIndex, columnTickets.length))
  const nextColumnTickets = [...columnTickets]

  nextColumnTickets.splice(clampedIndex, 0, updatedTicket)

  const nextTickets: BoardTicket[] = []
  let columnInserted = false

  for (const ticket of withoutDragged) {
    if (ticket.column === targetColumn) {
      if (!columnInserted) {
        nextTickets.push(...nextColumnTickets)
        columnInserted = true
      }

      continue
    }

    nextTickets.push(ticket)
  }

  if (!columnInserted) {
    nextTickets.push(...nextColumnTickets)
  }

  return nextTickets
}

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
  const [tickets, setTickets] = useState<BoardTicket[]>(() =>
    initialTickets.map((ticket) => ({ ...ticket })),
  )
  const [filterText, setFilterText] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isFilterInputFocused, setIsFilterInputFocused] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [columnsWidth, setColumnsWidth] = useState<number | null>(null)
  const [draggingTicketId, setDraggingTicketId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<ColumnLabel | null>(null)
  const [dropIndicator, setDropIndicator] = useState<{
    column: ColumnLabel
    insertIndex: number
  } | null>(null)
  const boardScrollRef = useRef<HTMLDivElement>(null)
  const filterTagsRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const suppressClickRef = useRef(false)

  const tags = useMemo(
    () => [...new Set(tickets.map((ticket) => ticket.tag))].sort(),
    [tickets],
  )

  const tagScrollEdges = useScrollFadeEdges(filterTagsRef)

  const visibleTickets = useMemo(
    () =>
      tickets.filter(
        (ticket) =>
          ticketMatchesFilter(ticket, filterText) &&
          (!selectedTag || ticket.tag === selectedTag),
      ),
    [tickets, filterText, selectedTag],
  )

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId],
  )

  const isBoardFilterActive = isFilterInputFocused || selectedTag !== null
  const isDragging = draggingTicketId !== null

  const updateDropTarget = useCallback(
    (clientX: number, clientY: number, ticketId: string) => {
      const targetColumn = getColumnAtPoint(clientX, clientY)

      setDragOverColumn(targetColumn)

      if (!targetColumn) {
        setDropIndicator(null)
        return
      }

      const { insertIndex } = getVisibleInsertIndex(targetColumn, clientY, ticketId)

      setDropIndicator({
        column: targetColumn,
        insertIndex,
      })
    },
    [],
  )

  const activateDragIfReady = useCallback(() => {
    const dragState = dragStateRef.current

    if (
      !dragState ||
      dragState.isActive ||
      !dragState.delayElapsed ||
      !dragState.pointerHasMoved
    ) {
      return
    }

    const clone = dragState.ticketElement.cloneNode(true) as HTMLElement

    clone.classList.add('ticket-drag-clone')
    clone.style.width = `${dragState.ticketElement.getBoundingClientRect().width}px`
    clone.setAttribute('aria-hidden', 'true')

    document.body.appendChild(clone)
    positionDragClone(
      clone,
      dragState.lastClientX,
      dragState.lastClientY,
      dragState.offsetX,
      dragState.offsetY,
    )

    dragState.clone = clone
    dragState.isActive = true
    dragState.pointerY = dragState.lastClientY

    setDraggingTicketId(dragState.ticketId)
    updateDropTarget(
      dragState.lastClientX,
      dragState.lastClientY,
      dragState.ticketId,
    )
  }, [updateDropTarget])

  const clearDragState = useCallback(() => {
    const dragState = dragStateRef.current

    if (dragState?.delayTimerId) {
      window.clearTimeout(dragState.delayTimerId)
    }

    dragState?.clone?.remove()
    dragStateRef.current = null
    setDraggingTicketId(null)
    setDragOverColumn(null)
    setDropIndicator(null)
    document.body.style.userSelect = ''
  }, [])

  const finishDrag = useCallback(
    (clientX: number, clientY: number, ticketId: string, wasActive: boolean) => {
      if (wasActive) {
        const targetColumn = getColumnAtPoint(clientX, clientY)

        if (targetColumn) {
          const { insertIndex, visibleTicketIds } = getVisibleInsertIndex(
            targetColumn,
            clientY,
            ticketId,
          )

          setTickets((currentTickets) => {
            const columnInsertIndex = mapVisibleInsertToColumnIndex(
              currentTickets,
              targetColumn,
              ticketId,
              insertIndex,
              visibleTicketIds,
            )

            return insertTicketAtColumnIndex(
              currentTickets,
              ticketId,
              targetColumn,
              columnInsertIndex,
            )
          })
        }

        suppressClickRef.current = true
        window.setTimeout(() => {
          suppressClickRef.current = false
        }, 0)
      }

      clearDragState()
    },
    [clearDragState],
  )

  const handleTicketPointerDown = useCallback(
    (ticketId: string, event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) {
        return
      }

      const ticketElement = event.currentTarget
      const rect = ticketElement.getBoundingClientRect()

      dragStateRef.current = {
        ticketId,
        pointerId: event.pointerId,
        ticketElement,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        startX: event.clientX,
        startY: event.clientY,
        lastClientX: event.clientX,
        lastClientY: event.clientY,
        pointerY: event.clientY,
        pointerHasMoved: false,
        delayElapsed: false,
        isActive: false,
        delayTimerId: window.setTimeout(() => {
          const dragState = dragStateRef.current

          if (!dragState || dragState.ticketId !== ticketId) {
            return
          }

          dragState.delayElapsed = true
          activateDragIfReady()
        }, DRAG_ACTIVATION_DELAY_MS),
        clone: null,
      }

      ticketElement.setPointerCapture(event.pointerId)
      document.body.style.userSelect = 'none'
    },
    [activateDragIfReady],
  )

  const handleTicketPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const dragState = dragStateRef.current

      if (!dragState || event.pointerId !== dragState.pointerId) {
        return
      }

      dragState.lastClientX = event.clientX
      dragState.lastClientY = event.clientY
      dragState.pointerY = event.clientY

      if (!dragState.pointerHasMoved) {
        const deltaX = event.clientX - dragState.startX
        const deltaY = event.clientY - dragState.startY

        if (deltaX !== 0 || deltaY !== 0) {
          dragState.pointerHasMoved = true
          activateDragIfReady()
        }
      }

      if (!dragState.isActive || !dragState.clone) {
        return
      }

      positionDragClone(
        dragState.clone,
        event.clientX,
        event.clientY,
        dragState.offsetX,
        dragState.offsetY,
      )
      updateDropTarget(event.clientX, event.clientY, dragState.ticketId)
    },
    [activateDragIfReady, updateDropTarget],
  )

  const handleTicketPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const dragState = dragStateRef.current

      if (!dragState || event.pointerId !== dragState.pointerId) {
        return
      }

      event.currentTarget.releasePointerCapture(event.pointerId)
      finishDrag(
        event.clientX,
        event.clientY,
        dragState.ticketId,
        dragState.isActive,
      )
    },
    [finishDrag],
  )

  const handleTicketPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const dragState = dragStateRef.current

      if (!dragState || event.pointerId !== dragState.pointerId) {
        return
      }

      event.currentTarget.releasePointerCapture(event.pointerId)
      clearDragState()
    },
    [clearDragState],
  )

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
                    data-column={label}
                    className={cn(
                      'board-column',
                      isBoardFilterActive && 'board-column--filter-active',
                      isDragging && 'board-column--drag-active',
                      dragOverColumn === label && 'board-column--drag-over',
                    )}
                  >
                    <h2 className="board-column-title">
                      <span>{label}</span>
                      <span className="board-column-count">{columnTickets.length}</span>
                    </h2>
                    <div className="board-column-tickets">
                      {columnTickets.reduce<ReactNode[]>((nodes, ticket, index) => {
                        if (
                          dropIndicator?.column === label &&
                          dropIndicator.insertIndex === index
                        ) {
                          nodes.push(
                            <div
                              key={`drop-indicator-${label}-${index}`}
                              className="board-drop-indicator"
                              aria-hidden="true"
                            />,
                          )
                        }

                        const { column, notes, ...ticketProps } = ticket

                        nodes.push(
                          <Ticket
                            key={ticket.id}
                            {...ticketProps}
                            isSelected={selectedTicketId === ticket.id}
                            isDragging={draggingTicketId === ticket.id}
                            onPointerDown={(event) =>
                              handleTicketPointerDown(ticket.id, event)
                            }
                            onPointerMove={handleTicketPointerMove}
                            onPointerUp={handleTicketPointerUp}
                            onPointerCancel={handleTicketPointerCancel}
                            onSelect={() => {
                              if (suppressClickRef.current) {
                                return
                              }

                              setSelectedTicketId((current) =>
                                current === ticket.id ? null : ticket.id,
                              )
                            }}
                          />,
                        )

                        return nodes
                      }, [])}
                      {dropIndicator?.column === label &&
                      dropIndicator.insertIndex === columnTickets.length ? (
                        <div
                          key={`drop-indicator-${label}-end`}
                          className="board-drop-indicator"
                          aria-hidden="true"
                        />
                      ) : null}
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
