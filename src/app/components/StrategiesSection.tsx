'use client'

import { motion } from 'framer-motion'
import { memo, useMemo } from 'react'
import {
  AreaChart,
  Area,
  Tooltip,
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
  returnPct: string
  drawdown: string
  capital: string
  seed: number
  trend: number
}

const strategies: Strategy[] = [
  { id: 1, name: 'Strategy I',   market: 'Metals',      risk: 'Moderate',   returnPct: '+38.40%', drawdown: '-8.2%',  capital: '$4.2M', seed: 11, trend: 0.004 },
  { id: 2, name: 'Strategy II',  market: 'Forex',       risk: 'Low',        returnPct: '+24.70%', drawdown: '-5.1%',  capital: '$6.1M', seed: 22, trend: 0.003 },
  { id: 3, name: 'Strategy III', market: 'Indices',     risk: 'High',       returnPct: '+52.10%', drawdown: '-14.3%', capital: '$3.8M', seed: 33, trend: 0.006 },
  { id: 4, name: 'Strategy IV',  market: 'Forex',       risk: 'Low',        returnPct: '+18.90%', drawdown: '-4.2%',  capital: '$2.4M', seed: 44, trend: 0.002 },
  { id: 5, name: 'Strategy V',   market: 'Commodities', risk: 'Aggressive', returnPct: '+67.30%', drawdown: '-22.1%', capital: '$1.9M', seed: 55, trend: 0.008 },
  { id: 6, name: 'Strategy VI',  market: 'Metals',      risk: 'Moderate',   returnPct: '+31.20%', drawdown: '-9.7%',  capital: '$2.8M', seed: 66, trend: 0.0035 },
]

const riskConfig: Record<RiskLevel, { color: string; dots: number; bg: string }> = {
  Low:        { color: '#2be6b6', dots: 1, bg: 'rgba(43,230,182,0.12)' },
  Moderate:   { color: '#60a5fa', dots: 2, bg: 'rgba(96,165,250,0.12)' },
  High:       { color: '#f59e0b', dots: 3, bg: 'rgba(245,158,11,0.12)' },
  Aggressive: { color: '#ef4444', dots: 4, bg: 'rgba(239,68,68,0.12)'  },
}

const CustomTooltip = memo(({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs shadow-lg">
        <p className="text-muted-foreground">{payload[0].payload.i}</p>
        <p className="font-semibold text-foreground">
          Equity : ${payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
})

CustomTooltip.displayName = 'CustomTooltip'

const RiskBadge = memo(({ risk }: { risk: RiskLevel }) => {
  const cfg = riskConfig[risk]
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold"
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
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3"
    >
      {/* Card header */}
      <div className="flex items-center justify-between">
        <RiskBadge risk={strategy.risk} />
      </div>

      {/* Strategy name */}
      <p className="text-[19px] font-bold text-foreground">{strategy.name}</p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Return',   value: strategy.returnPct, accent: true },
          { label: 'Drawdown', value: strategy.drawdown },
          { label: 'Capital',  value: strategy.capital },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[13  px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
              {s.label}
            </p>
            <p className={`text-[17px] font-bold ${s.accent ? 'text-primary' : 'text-foreground'}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Mini chart */}
      <div className="h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#d4af37" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#d4af37"
              strokeWidth={1.5}
              fill={`url(#grad-${strategy.id})`}
              dot={false}
              activeDot={{ r: 4, fill: '#d4af37', stroke: '#0a0a0a', strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
})

StrategyCard.displayName = 'StrategyCard'

export const StrategiesSection = memo(function StrategiesSection() {
  return (
    <section id='strategies' className="px-6 pb-24 md:px-12 lg:px-16">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
          Anonymous Performance
        </p>
        <h2 className="mb-2 text-3xl font-bold text-foreground md:text-[42px]">
          Strategies in production
        </h2>
        <p className="text-[15px] text-muted-foreground">
          Aggregated equity curves from real client capital. Names hidden, numbers live.
        </p>
      </motion.div>

      {/* Grid */}
      <div  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy, i) => (
          <StrategyCard key={strategy.id} strategy={strategy} index={i} />
        ))}
      </div>
    </section>
  )
})
