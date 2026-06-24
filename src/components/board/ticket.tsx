import type { PointerEvent } from 'react'
import { cn } from '@/lib/utils'

type TicketProps = {
  id: string
  title: string
  description: string
  tag: string
  assignee: string
  isSelected?: boolean
  isDragging?: boolean
  onSelect?: () => void
  onPointerDown?: (event: PointerEvent<HTMLElement>) => void
  onPointerMove?: (event: PointerEvent<HTMLElement>) => void
  onPointerUp?: (event: PointerEvent<HTMLElement>) => void
  onPointerCancel?: (event: PointerEvent<HTMLElement>) => void
}

export default function Ticket({
  id,
  title,
  description,
  tag,
  assignee,
  isSelected = false,
  isDragging = false,
  onSelect,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: TicketProps) {
  return (
    <article
      className={cn(
        'ticket',
        isSelected && 'ticket--selected',
        isDragging && 'ticket--dragging',
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (onSelect && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onSelect()
        }
      }}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={onSelect ? isSelected : undefined}
      data-ticket-id={id}
    >
      <div className="ticket-header">
        <span className="ticket-id">{id}</span>
        <span className="ticket-assignee" aria-label={`Assigned to ${assignee}`}>
          {assignee}
        </span>
      </div>
      <h3 className="ticket-title">{title}</h3>
      <p className="ticket-description">{description}</p>
      <span className="ticket-tag">{tag}</span>
    </article>
  )
}
