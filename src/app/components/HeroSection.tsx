'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden bg-background px-4 text-center">

      {/* Radial glow background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(43,230,182,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Real-time MT5 data — fully transparent
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 max-w-3xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
      >
        Copy-trading
        <br />
        performance,{' '}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-primary"
        >
          verified
          <br />
          live.
        </motion.span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
      >
        A read-only client portal streaming real-time equity, drawdown and trade
        data straight from connected MetaTrader 5 accounts. No promises. Just
        numbers.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(43,230,182,0.35)' }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View live dashboard
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(43,230,182,0.08)' }}
          whileTap={{ scale: 0.97 }}
          className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors"
        >
          Explore strategies
        </motion.button>
      </motion.div>
    </section>
  )
}
