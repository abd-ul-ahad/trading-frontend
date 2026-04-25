'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

const items = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Read-only by design',
    description: 'No trading, no withdrawals, no control. The portal is a window never a lever.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'Per-second ingestion',
    description: 'Live MT5 feeds with timestamped data points and FX-converted USD reporting.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Fully auditable',
    description: 'Equity curves, drawdowns and trade history are sourced not manually entered.',
  },
]

export const TrustSection = memo(function TrustSection() {
  return (
    <section id='transparency' className="px-6 pb-24 md:px-12 lg:px-16">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="mb-4 inline-flex items-center justify-center rounded-lg border border-primary/20 bg-primary/10 p-2 text-primary">
              {item.icon}
            </div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
})
