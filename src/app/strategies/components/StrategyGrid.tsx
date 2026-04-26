'use client'

import { motion } from 'framer-motion'
import { memo, useMemo } from 'react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts'

// Seeded random for SSR consistency
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateEquityCurve(seed: number, points = 60, startValue = 100000, trend = 0.003) {
  const rand = seededRandom(seed)
  const data = []
  let value = startValue
  for (let i = 0; i < points; i++) {
    value = value * (1 + trend + (rand() - 0.48) * 0.015)
    data.push({ i, equity: Math.round(value) })
  }
  return data
}

type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Aggressive'

interface Strategy {
  id: number
  name: string
  market: string
  risk: RiskLevel
  ytdReturn: string
  maxDrawdown: string
  sharpeRatio: string
  capital: string
  inception: string
  seed: number
  trend: number
  invested?: boolean
}

const strategies: Strategy[] = [
  { id: 1, name: 'Alpha Metals I', market: 'Metals', risk: 'Moderate', ytdReturn: '+38.40%', maxDrawdown: '-8.2%', sharpeRatio: '2.4', capital: '$4.2M', inception: 'Jan 2024', seed: 11, trend: 0.004, invested: true },
  { id: 2, name: 'Forex Scalper Pro', market: 'Forex', risk: 'Low', ytdReturn: '+24.70%', maxDrawdown: '-5.1%', sharpeRatio: '3.1', capital: '$6.1M', inception: 'Mar 2023', seed: 22, trend: 0.003 },
  { id: 3, name: 'Index Momentum', market: 'Indices', risk: 'High', ytdReturn: '+52.10%', maxDrawdown: '-14.3%', sharpeRatio: '1.8', capital: '$3.8M', inception: 'Jun 2024', seed: 33, trend: 0.006 },
  { id: 4, name: 'Conservative FX', market: 'Forex', risk: 'Low', ytdReturn: '+18.90%', maxDrawdown: '-4.2%', sharpeRatio: '2.9', capital: '$2.4M', inception: 'Feb 2024', seed: 44, trend: 0.002, invested: true },
  { id: 5, name: 'Commodity Surge', market: 'Commodities', risk: 'Aggressive', ytdReturn: '+67.30%', maxDrawdown: '-22.1%', sharpeRatio: '1.5', capital: '$1.9M', inception: 'Aug 2024', seed: 55, trend: 0.008 },
  { id: 6, name: 'Gold Standard', market: 'Metals', risk: 'Moderate', ytdReturn: '+31.20%', maxDrawdown: '-9.7%', sharpeRatio: '2.2', capital: '$2.8M', inception: 'Apr 2024', seed: 66, trend: 0.0035, invested: true },
  { id: 7, name: 'EUR/USD Master', market: 'Forex', risk: 'Low', ytdReturn: '+22.50%', maxDrawdown: '-6.3%', sharpeRatio: '2.7', capital: '$5.3M', inception: 'Jan 2023', seed: 77, trend: 0.0028 },
  { id: 8, name: 'S&P Tracker', market: 'Indices', risk: 'Moderate', ytdReturn: '+29.80%', maxDrawdown: '-10.5%', sharpeRatio: '2.0', capital: '$4.7M', inception: 'May 2024', seed: 88, trend: 0.0032 },
  { id: 9, name: 'Oil Volatility', market: 'Commodities', risk: 'High', ytdReturn: '+44.60%', maxDrawdown: '-16.8%', sharpeRatio: '1.6', capital: '$2.1M', inception: 'Jul 2024', seed: 99, trend: 0.005 },
  { id: 10, name: 'Silver Swing', market: 'Metals', risk: 'Moderate', ytdReturn: '+35.70%', maxDrawdown: '-11.2%', sharpeRatio: '2.1', capital: '$3.5M', inception: 'Mar 2024', seed: 110, trend: 0.0038 },
  { id: 11, name: 'Multi-Pair FX', market: 'Forex', risk: 'Moderate', ytdReturn: '+27.30%', maxDrawdown: '-7.9%', sharpeRatio: '2.5', capital: '$4.9M', inception: 'Feb 2023', seed: 121, trend: 0.003 },
  { id: 12, name: 'NASDAQ Growth', market: 'Indices', risk: 'High', ytdReturn: '+48.20%', maxDrawdown: '-13.6%', sharpeRatio: '1.9', capital: '$3.2M', inception: 'Sep 2024', seed: 132, trend: 0.0055 },
]

const riskConfig: Record<RiskLevel, { color: string; dots: number; bg: string }> = {
  Low: { color: '#2be6b6', dots: 1, bg: 'rgba(43,230,182,0.12)' },
  Moderate: { color: '#60a5fa', dots: 2, bg: 'rgba(96,165,250,0.12)' },
  High: { color: '#f59e0b', dots: 3, bg: 'rgba(245,158,11,0.12)' },
  Aggressive: { color: '#ef4444', dots: 4, bg: 'rgba(239,68,68,0.12)' },
}

const RiskBadge = memo(({ risk }: { risk: RiskLevel }) => {
  const cfg = riskConfig[risk]
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {Array.from({ length: cfg.dots }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color }} />
      ))}
      {risk}
    </span>
  )
})

RiskBadge.displayName = 'RiskBadge'

const StrategyCard = memo(({ strategy, index }: { strategy: Strategy; index: number }) => {
  const data = useMemo(() => generateEquityCurve(strategy.seed, 60, 100000, strategy.trend), [strategy.seed, strategy.trend])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lg"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-bold text-foreground">{strategy.name}</h3>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {strategy.market}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <RiskBadge risk={strategy.risk} />
          {strategy.invested && (
            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
              Invested
            </span>
          )}
        </div>
      </div>

      {/* Mini Chart */}
      <div className="mb-4 h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#d4af37" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#d4af37"
              strokeWidth={1.5}
              fill={`url(#grad-${strategy.id})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            YTD Return
          </p>
          <p className="text-base font-bold text-primary">{strategy.ytdReturn}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Max Drawdown
          </p>
          <p className="text-base font-bold text-foreground">{strategy.maxDrawdown}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Sharpe Ratio
          </p>
          <p className="text-base font-bold text-foreground">{strategy.sharpeRatio}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Capital
          </p>
          <p className="text-base font-bold text-foreground">{strategy.capital}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">Since {strategy.inception}</span>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground cursor-pointer transition-opacity hover:opacity-90">
          View details
        </button>
      </div>
    </motion.div>
  )
})

StrategyCard.displayName = 'StrategyCard'

export const StrategyGrid = memo(function StrategyGrid() {
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy, i) => (
          <StrategyCard key={strategy.id} strategy={strategy} index={i} />
        ))}
      </div>
    </section>
  )
})
