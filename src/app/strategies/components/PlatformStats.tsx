'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

const stats = [
  { label: 'Active strategies', value: '12' },
  { label: 'Platform avg YTD', value: '+21.4%', accent: true },
  { label: 'In your portfolio', value: '3' },
]

export const PlatformStats = memo(function PlatformStats() {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card px-5 py-5"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold md:text-3xl ${stat.accent ? 'text-primary' : 'text-foreground'}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
})
