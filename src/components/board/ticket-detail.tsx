import { X } from 'lucide-react'

export type TicketDetailTicket = {
  id: string
  title: string
  description: string
  tag: string
  assignee: string
  column: string
  notes: string
}

type TicketDetailProps = {
  ticket: TicketDetailTicket
  onClose: () => void
}

export default function TicketDetail({ ticket, onClose }: TicketDetailProps) {
  return (
    <aside className="ticket-detail ml-1" aria-label={`Ticket detail for ${ticket.id}`}>
      <div className="ticket-detail-header">
        <h2 className="ticket-detail-title">{ticket.id}</h2>
        <button
          type="button"
          className="ticket-detail-close"
          onClick={onClose}
          aria-label="Close ticket detail"
        >
          <X size={16} strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      <div className="ticket-detail-content">
        <dl className="ticket-detail-fields">
          <div className="ticket-detail-field">
            <dt>Title</dt>
            <dd>{ticket.title}</dd>
          </div>
          <div className="ticket-detail-field">
            <dt>Description</dt>
            <dd>{ticket.description}</dd>
          </div>
          <div className="ticket-detail-field">
            <dt>Tag</dt>
            <dd>{ticket.tag}</dd>
          </div>
          <div className="ticket-detail-field">
            <dt>Assignee</dt>
            <dd>{ticket.assignee}</dd>
          </div>
          <div className="ticket-detail-field">
            <dt>Column</dt>
            <dd>{ticket.column}</dd>
          </div>
          <div className="ticket-detail-field">
            <dt>Notes</dt>
            <dd className="ticket-detail-notes">
              {ticket.notes.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}
