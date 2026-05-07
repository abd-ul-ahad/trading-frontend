'use client'

import { motion } from 'framer-motion'
import { HeroChart } from './HeroChart'

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-background px-4 py-16 md:px-8 lg:px-16">

      {/* Radial glow background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />

      {/* 2-Column Grid Layout */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        
        {/* Left Column - Text Content */}
        <div className="flex flex-col items-start text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Live performance data · Verified on MT5
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Where capital
            <br />
            meets{' '}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-primary"
            >
              verified
              <br />
              performance.
            </motion.span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-[19px]"
          >
            Oroviax connects serious investors with independently verified trading strategies — every equity curve sourced live from MT5, unfiltered and unadjusted. Choose your risk. Track your returns. No black boxes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(212,175,55,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open account — it's free
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
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,175,55,0.08)' }}
              whileTap={{ scale: 0.97 }}
              className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors"
            >
              Explore strategies →
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column - Chart */}
        <div className="flex items-center justify-center">
          <HeroChart />
        </div>

      </div>
    </section>
  )
}
