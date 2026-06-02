'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'
import { StrategiesGrid } from './StrategiesGrid'
export const StrategiesSection = memo(function StrategiesSection() {
  return (
    <section id="strategies" className="px-6 pb-24 md:px-12 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="mb-2 text-lg font-semibold uppercase tracking-widest text-primary">
          Trading Strategies
        </p>
        <h2 className="mb-2 text-3xl font-bold text-foreground md:text-[42px]">
          Available Strategies
        </h2>
        <p className="text-[20px] text-muted-foreground">
          Browse our collection of active trading strategies.
        </p>
      </motion.div>
      <StrategiesGrid />
    </section>
  )
})
