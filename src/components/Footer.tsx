'use client'

import Link from 'next/link'
import { memo } from 'react'

export const Footer = memo(function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-6 py-6 md:px-12 lg:px-16">
        <div className="flex flex-wrap items-center gap-4 text-xs md:gap-6">
          {/* Brand */}
          <span className="text-foreground">Oroviax</span>
          
          {/* Links */}
          <Link href="/privacy" className="uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
            Terms
          </Link>
          
          {/* Disclaimer */}
          <span className="text-muted-foreground">
            Past performance does not guarantee future results. All data sourced directly from verified MT5 accounts.
          </span>
        </div>
      </div>
    </footer>
  )
})
