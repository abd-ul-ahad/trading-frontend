'use client'

import Link from 'next/link'
import { memo } from 'react'

const footerLinks = {
  platform: [
    { label: 'Strategies', href: '/strategies' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'FAQ', href: '/#faq' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
}

export const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-bold text-foreground">Oroviax</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Verified performance
              </span>
            </Link>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-foreground">
              Platform
            </h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-foreground">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Past performance does not guarantee future results. All data sourced directly from verified MT5 accounts.
          </p>
        </div>
      </div>
    </footer>
  )
})
