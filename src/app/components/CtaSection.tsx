'use client'

import { motion } from 'framer-motion'
import { memo } from 'react'

export const CtaSection = memo(function CtaSection() {
  return (
    <section className="px-6 pb-24 md:px-12 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card px-8 py-16 text-center"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      >
        {/* Trending-up icon */}
        <div className="mb-5 flex justify-center text-primary">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-foreground md:text-[32px]">
          Ready to track your portfolio?
        </h2>
        <p className="mb-8 text-[20px] text-muted-foreground">
          Sign in with your client credentials to access the live dashboard.
        </p>

        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Client sign in
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </motion.div>
    </section>
  )
})
