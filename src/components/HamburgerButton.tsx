'use client'

interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function HamburgerButton({ isOpen, onClick, className = '' }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <span
          className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
          }`}
        />
      </div>
    </button>
  )
}
