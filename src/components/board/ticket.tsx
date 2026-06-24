import { cn } from '@/lib/utils'

type TicketProps = {
  id: string
  title: string
  description: string
  tag: string
  assignee: string
  isSelected?: boolean
  onSelect?: () => void
}

export default function Ticket({
  id,
  title,
  description,
  tag,
  assignee,
  isSelected = false,
  onSelect,
}: TicketProps) {
  return (
    <article
      className={cn('ticket', isSelected && 'ticket--selected')}
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
