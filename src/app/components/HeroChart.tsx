'use client'

import { motion } from 'framer-motion'
import { memo, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Seeded pseudo-random for SSR/client consistency
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Generate realistic upward-trending equity data
const generateData = (days: number, seed: number) => {
  const rand = seededRandom(seed)
  const data = []
  const start = new Date()
  start.setDate(start.getDate() - days)
  let value = 22000000
  for (let i = 0; i <= days; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    if (date.getDay() === 0 || date.getDay() === 6) continue
    value += rand() * 120000 - 20000
    value = Math.max(value, 21000000)
    data.push({
      date: date.toISOString().split('T')[0],
      equity: Math.round(value),
    })
  }
  return data
}

const formatYAxis = (value: number) => {
  if (value === 0) return '$0M'
  return `$${(value / 1000000).toFixed(1)}M`
}

const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-lg">
        <p className="mb-1 text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">
          ${(payload[0].value / 1000000).toFixed(2)}M
        </p>
      </div>
    )
  }
  return null
})

CustomTooltip.displayName = 'CustomTooltip'

type TimePeriod = '1D' | '1W' | '1M' | '1Y' | 'Max'

export const HeroChart = memo(function HeroChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1W')

  const data = useMemo(() => {
    const periodMap = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '1Y': 365,
      'Max': 730,
    }
    return generateData(periodMap[selectedPeriod], 123)
  }, [selectedPeriod])

  const latestValue = data[data.length - 1]?.equity ?? 24830000

  const periods: TimePeriod[] = ['1D', '1W', '1M', '1Y', 'Max']

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="w-full"
      style={{
        filter: 'drop-shadow(0 0 40px rgba(212,175,55,0.12)) drop-shadow(0 20px 60px rgba(0,0,0,0.5))',
      }}
    >
      <div className="rounded-2xl border border-border bg-card p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Platform Aggregate Equity
            </p>
            <p className="text-3xl font-bold text-foreground">
              ${(latestValue / 1000000).toFixed(3).replace(/\.?0+$/, '')}M
            </p>
          </div>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            +7.4% this week
          </span>
        </div>

        {/* Time Period Buttons */}
        <div className="mb-4 flex gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`cursor-pointer rounded px-3 py-1 text-xs font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="heroEquityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity={0.3} />
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
                tick={{ fill: '#a3a3a3', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                hide
              />

              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fill: '#a3a3a3', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={50}
                domain={['auto', 'auto']}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: 'rgba(212,175,55,0.3)', strokeWidth: 1 }}
              />

              <Area
                type="monotone"
                dataKey="equity"
                stroke="#d4af37"
                strokeWidth={2}
                fill="url(#heroEquityGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#d4af37',
                  stroke: '#0a0a0a',
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              Max Drawdown
            </p>
            <p className="text-sm font-semibold text-red-500">-5.2%</p>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              YTD Return
            </p>
            <p className="text-sm font-semibold text-primary">+21.4%</p>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
              Active Strategies
            </p>
            <p className="text-sm font-semibold text-foreground">12</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
})
