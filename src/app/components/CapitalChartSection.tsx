'use client'

import { motion } from 'framer-motion'
import { memo, useEffect, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { strategyApi } from '@/lib/api/strategyApi'

// Seeded pseudo-random for SSR/client consistency
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Generate realistic upward-trending equity data from Jan to Apr 2026
const generateData = () => {
  const rand = seededRandom(42)
  const data = []
  const start = new Date('2026-01-01')
  let value = 9800000
  for (let i = 0; i <= 114; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    if (date.getDay() === 0 || date.getDay() === 6) continue
    value += rand() * 80000 - 10000
    value = Math.max(value, 9500000)
    data.push({
      date: date.toISOString().split('T')[0],
      equity: Math.round(value),
    })
  }
  return data
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export const CapitalChartSection = memo(function CapitalChartSection() {
  const data = useMemo(() => generateData(), [])
  const tickDates = useMemo(() => 
    data.filter((_, i) => i % Math.floor(data.length / 9) === 0).map((d) => d.date),
    [data]
  )

  const [activeCount, setActiveCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const strategies = await strategyApi.getAllStrategies()
        if (cancelled) return
        setActiveCount(strategies.length)
      } catch (err) {
        console.error('Failed to load active strategies count:', err)
        if (!cancelled) setActiveCount(null)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const activeLabel =
    activeCount === null
      ? '… active strategies'
      : `${activeCount} active ${activeCount === 1 ? 'strategy' : 'strategies'}`

  return (
    <section id='performance'  className="relative px-6 pb-24 md:px-12 lg:px-16">
      {/* Outer glow shadow matching the design */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full"
        style={{
          filter: 'drop-shadow(0 0 60px rgba(212,175,55,0.10)) drop-shadow(0 32px 80px rgba(0,0,0,0.6))',
        }}
      >
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          {/* Header row */}
          <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
            <span className="rounded-full bg-primary/15 px-3 py-1 text-[13px] font-semibold text-primary">
              +2.4% this week
            </span>
            <span className="text-[13px] text-muted-foreground">
              {activeLabel} · 847 clients
            </span>
          </div>

          {/* Chart */}
          <div className="h-64 w-full md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity={0.01} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  ticks={tickDates}
                  tickFormatter={formatDate}
                  tick={{ fill: '#a3a3a3', fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />

                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#d4af37"
                  strokeWidth={2}
                  fill="url(#equityGradient)"
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </section>
  )
})
