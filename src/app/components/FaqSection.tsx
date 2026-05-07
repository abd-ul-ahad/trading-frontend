'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { memo, useState } from 'react'

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: 'How is the performance data verified?',
    answer: 'All performance data is sourced directly from connected MT5 accounts in real time. We do not accept broker-reported summaries or manually uploaded records. Every equity curve you see reflects live, audited account data — nothing simulated, nothing adjusted.',
  },
  {
    question: 'Why are strategy names hidden on the public site?',
    answer: 'Strategy names are disclosed to verified account holders only. This protects proprietary trading logic from being reverse-engineered based on public performance data. Full strategy details — name, trading style, broker profile — are accessible after signing in.',
  },
  {
    question: 'Who manages the strategies?',
    answer: 'Each strategy is managed by an independently verified broker with a proven live track record. Brokers are reviewed by Oroviax before being listed. Their verified status, trading history, and full performance record are visible within the platform once you create an account.',
  },
  {
    question: 'Can I invest in multiple strategies at once?',
    answer: 'Yes. Most clients diversify across two or more strategies spanning different asset classes and risk levels. Your portfolio dashboard aggregates performance across all active investments while letting you drill into each strategy individually.',
  },
  {
    question: 'What asset classes are available?',
    answer: 'Oroviax currently offers strategies across four asset classes: Metals (gold, silver, platinum), Forex (G10 majors and EM pairs), Indices, and Other Commodities. New strategies are added as brokers pass our verification process.',
  },
  {
    question: 'How do I get started?',
    answer: 'Create an account, browse available strategies with their full performance histories, and choose the ones that match your goals and risk appetite. If you have questions before signing up, use the contact form below — we respond within one business day.',
  },
]

const FaqItem = memo(({ faq, index }: { faq: FaqItem; index: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border-b border-border"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-primary"
      >
        <span className="text-base font-semibold text-foreground md:text-[19px]">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-2xl font-light text-primary"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

FaqItem.displayName = 'FaqItem'

export const FaqSection = memo(function FaqSection() {
  return (
    <section id="faq" className="px-6 pb-24 md:px-12 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
          FAQ
        </p>
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-[42px] lg:text-5xl">
          Questions,
          <br />
          <span className="text-primary">answered.</span>
        </h2>
      </motion.div>

      <div className="mx-auto max-w-3xl">
        {faqs.map((faq, index) => (
          <FaqItem key={index} faq={faq} index={index} />
        ))}
      </div>
    </section>
  )
})
