type SidebarToggleIconProps = {
  className?: string
}

export function SidebarOpenIcon({ className }: SidebarToggleIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden
    >
      <rect
        x="2"
        y="3"
        width="12"
        height="10"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 3v10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SidebarClosedIcon({ className }: SidebarToggleIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden
    >
      <rect
        x="2"
        y="3"
        width="12"
        height="10"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 3v10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 6l1.5 2L5 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
