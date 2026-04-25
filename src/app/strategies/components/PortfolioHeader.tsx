'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

export const PortfolioHeader = memo(function PortfolioHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-8 rounded-xl border border-border bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            My portfolio
          </p>
          <p className="text-3xl font-bold text-foreground md:text-4xl">
            $86,000
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-xl font-bold">J</span>
        </div>
      </div>
    </motion.div>
  )
})
