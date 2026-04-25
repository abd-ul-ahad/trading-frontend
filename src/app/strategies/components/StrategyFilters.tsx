'use client'

import { motion } from 'framer-motion'
import { memo, useState } from 'react'
import { Select, SelectOption } from '@/components/Select'

const categories = ['All', 'Metals', 'Forex', 'Indices', 'Commodities', 'Invested']

const sortOptions: SelectOption[] = [
  { value: 'ytd-desc', label: 'YTD Return ↓' },
  { value: 'drawdown-asc', label: 'Max Drawdown ↑' },
  { value: 'sharpe-desc', label: 'Sharpe Ratio ↓' },
  { value: 'inception', label: 'Inception Date' },
]

export const StrategyFilters = memo(function StrategyFilters() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('ytd-desc')

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by</span>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              className="w-48 cursor-pointer"
            />
          </div>
          <span className="text-sm text-muted-foreground">12 strategies</span>
        </div>
      </div>
    </motion.section>
  )
})
