'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { memo } from 'react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts'
import {
  strategyApi,
  Strategy,
  StrategyPerformance,
  EquityCurvePoint,
  Trade,
} from '@/lib/api/strategyApi'

const toNum = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : 0
}

type ChartPoint = { i: number; equity: number }

function normalizeEquityCurve(raw: unknown): EquityCurvePoint[] {
  if (!Array.isArray(raw)) return []
  return raw.map((p: Record<string, unknown>) => ({
    timestamp: String(p.timestamp ?? p.Timestamp ?? ''),
    totalPnL: toNum(p.totalPnL ?? p.total_pnl ?? p.TotalPnL),
    drawdown: toNum(p.drawdown ?? p.Drawdown),
  }))
}

function equitySeriesFromCurve(curve: EquityCurvePoint[]): ChartPoint[] {
  return curve.map((p, i) => ({
    i,
    equity: toNum(p.totalPnL),
  }))
}

function buildSeriesFromTrades(trades: Trade[]): ChartPoint[] {
  const closed = trades
    .filter((t) => t.status === 'closed' && t.exit_time)
    .sort(
      (a, b) =>
        new Date(a.exit_time!).getTime() - new Date(b.exit_time!).getTime()
    )

  if (closed.length === 0) return []

  let cumulative = 0
  const series: ChartPoint[] = [{ i: 0, equity: 0 }]
  closed.forEach((trade, idx) => {
    cumulative += toNum(trade.pnl)
    series.push({ i: idx + 1, equity: Math.round(cumulative) })
  })
  return series.length >= 2 ? series : []
}

/** Deterministic ramp from zero to current total P&L when no history exists. */
function buildSeriesFromPerformance(
  performance: StrategyPerformance,
  points = 40
): ChartPoint[] {
  const total = toNum(performance.totalPnL)
  if (points < 2) return []
  return Array.from({ length: points }, (_, i) => ({
    i,
    equity: Math.round((total * i) / (points - 1)),
  }))
}

function resolveChartSeries(
  curve: EquityCurvePoint[] | null,
  trades: Trade[],
  performance: StrategyPerformance | null
): ChartPoint[] {
  if (curve && curve.length >= 2) {
    return equitySeriesFromCurve(curve)
  }
  const fromTrades = buildSeriesFromTrades(trades)
  if (fromTrades.length >= 2) return fromTrades
  if (performance) {
    const fromPerf = buildSeriesFromPerformance(performance)
    if (fromPerf.length >= 2) return fromPerf
  }
  return []
}

function ytdFromPerformance(performance: StrategyPerformance): number {
  const total = toNum(performance.totalPnL)
  const maxDd = toNum(performance.maxDrawdown)
  const basis = Math.max(Math.abs(total) + maxDd, maxDd * 5, 1)
  return (total / basis) * 100
}

function resolveYtdReturn(
  series: ChartPoint[],
  performance: StrategyPerformance | null
): number | null {
  if (series.length >= 2) {
    const fromSeries = calcReturnPctFromSeries(series)
    if (fromSeries !== null) return fromSeries
  }
  if (performance) return ytdFromPerformance(performance)
  return null
}

function calcReturnPctFromSeries(series: { equity: number }[]): number | null {
  if (series.length < 2) return null
  const first = series[0].equity
  const last = series[series.length - 1].equity
  if (first === 0) return last > 0 ? 100 : 0
  return ((last - first) / Math.abs(first)) * 100
}

function calcMaxDrawdownPctFromSeries(series: { equity: number }[]): number {
  if (series.length < 2) return 0
  let peak = series[0].equity
  let maxDd = 0
  for (const { equity } of series) {
    if (equity > peak) peak = equity
    const base = Math.abs(peak) || 1
    const dd = ((equity - peak) / base) * 100
    if (dd < maxDd) maxDd = dd
  }
  return maxDd
}

function formatSince(dateStr: string): string {
  const d = new Date(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${mm}/${yyyy}`
}

function calcTradesPerMonth(totalTrades: number, createdAt: string): number {
  const created = new Date(createdAt)
  const now = new Date()
  const months =
    (now.getFullYear() - created.getFullYear()) * 12 +
    (now.getMonth() - created.getMonth()) +
    1
  return Math.max(1, Math.round(totalTrades / Math.max(1, months)))
}

function formatPct(value: number | null): string {
  if (value === null) return '—'
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

function formatMaxDd(
  series: ChartPoint[],
  curve: EquityCurvePoint[] | null,
  performance: StrategyPerformance | null
): string {
  if (curve && curve.length >= 2 && series.length >= 2) {
    const pct = calcMaxDrawdownPctFromSeries(series)
    return `${pct.toFixed(1)}%`
  }
  if (series.length >= 2) {
    const pct = calcMaxDrawdownPctFromSeries(series)
    if (pct < 0) return `${pct.toFixed(1)}%`
  }
  if (performance) {
    const dd = toNum(performance.maxDrawdown)
    if (dd > 0) {
      return `-$${dd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return '0.0%'
  }
  return '—'
}

const STRATEGY_META = [
  {
    risk: 3,
    desc: 'Momentum-driven approach to precious metals with systematic entry and exit signals.',
  },
  {
    risk: 2,
    desc: 'Systematic FX strategy targeting major pairs with defined risk parameters per trade.',
  },
  {
    risk: 4,
    desc: 'Trend-following index strategy with volatility-adjusted position sizing.',
  },
  {
    risk: 3,
    desc: 'Diversified commodities exposure using quantitative momentum and mean-reversion signals.',
  },
] as const

interface StrategyWithData extends Strategy {
  performance: StrategyPerformance | null
  equityCurve: EquityCurvePoint[] | null
  chartSeries: ChartPoint[]
  loadingPerf: boolean
}

const StatCell = memo(function StatCell({
  label,
  value,
  valueClassName = 'text-white',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div>
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#8a847c] mb-1.5">
        {label}
      </p>
      <p
        className={`font-outfit text-[22px] font-semibold leading-none tracking-normal ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  )
})

StatCell.displayName = 'StatCell'

const StrategyMiniChart = memo(function StrategyMiniChart({
  strategyId,
  chartData,
}: {
  strategyId: string
  chartData: { i: number; equity: number }[]
}) {
  const gradientId = `strat-grad-${strategyId}`

  return (
    <div className="h-[88px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#d4af37" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="equity"
            stroke="#d4af37"
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
})

StrategyMiniChart.displayName = 'StrategyMiniChart'

const StrategyCard = memo(function StrategyCard({
  strategy,
  index,
}: {
  strategy: StrategyWithData
  index: number
}) {
  const meta = STRATEGY_META[index % STRATEGY_META.length]

  const chartData = strategy.chartSeries

  const ytdReturn = useMemo(
    () => resolveYtdReturn(chartData, strategy.performance),
    [chartData, strategy.performance]
  )

  const maxDdLabel = useMemo(
    () => formatMaxDd(chartData, strategy.equityCurve, strategy.performance),
    [chartData, strategy.equityCurve, strategy.performance]
  )

  const tradesPerMonth = useMemo(() => {
    if (!strategy.performance) return null
    return calcTradesPerMonth(
      strategy.performance.totalTrades,
      strategy.createdAt
    )
  }, [strategy.performance, strategy.createdAt])

  const winRatePct = useMemo(() => {
    if (!strategy.performance) return null
    return toNum(strategy.performance.winRate) * 100
  }, [strategy.performance])

  const ytdLabel = formatPct(ytdReturn)
  const winRateLabel =
    winRatePct === null ? '—' : `${winRatePct.toFixed(1)}%`
  const maxDdIsNegative =
    maxDdLabel.startsWith('-') && !maxDdLabel.startsWith('-$')

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a] p-6 md:p-7 transition-colors hover:border-[rgba(255,255,255,0.13)]"
    >
      {/* Risk indicator */}
      <div className="mb-4 flex justify-end gap-1">
        {[1, 2, 3, 4].map((pip) => (
          <div
            key={pip}
            className={`h-1.5 w-1.5 rounded-full ${
              pip <= meta.risk
                ? 'bg-[rgba(200,160,60,0.65)]'
                : 'bg-[rgba(255,255,255,0.1)]'
            }`}
          />
        ))}
      </div>

      {/* Title */}
      <h3 className="font-display mb-3 text-[28px] font-normal leading-[1.1] tracking-[-0.01em] text-white md:text-[30px]">
        {strategy.name}
      </h3>

      {/* Description */}
      <p className="font-outfit mb-5 text-[14px] leading-[1.75] text-[#a39b93]">
        {meta.desc}
      </p>

      {/* Chart */}
      <div className="mb-5 border-b border-[rgba(255,255,255,0.05)] pb-5">
        {strategy.loadingPerf ? (
          <div className="flex h-[88px] items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#d4af37] border-t-transparent" />
          </div>
        ) : chartData.length > 0 ? (
          <StrategyMiniChart strategyId={strategy.id} chartData={chartData} />
        ) : (
          <div className="flex h-[88px] items-center justify-center">
            <p className="font-outfit text-[13px] text-[#8a847c]">No chart data yet</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
        <StatCell
          label="YTD Return"
          value={strategy.loadingPerf ? '…' : ytdLabel}
          valueClassName={
            ytdReturn !== null && ytdReturn >= 0
              ? 'text-[#e8c84a]'
              : ytdReturn !== null
                ? 'text-[#ff7e7e]'
                : 'text-[#8a847c]'
          }
        />
        <StatCell
          label="Max DD"
          value={strategy.loadingPerf ? '…' : maxDdLabel}
          valueClassName={
            maxDdIsNegative || maxDdLabel.startsWith('-$')
              ? 'text-[#e89999]'
              : 'text-white'
          }
        />
        <StatCell
          label="Win %"
          value={strategy.loadingPerf ? '…' : winRateLabel}
          valueClassName="text-white"
        />
        <StatCell label="Since" value={formatSince(strategy.createdAt)} />
        <StatCell
          label="Trades/Mo"
          value={
            strategy.loadingPerf
              ? '…'
              : tradesPerMonth !== null
                ? String(tradesPerMonth)
                : '—'
          }
        />
      </div>
    </motion.div>
  )
})

StrategyCard.displayName = 'StrategyCard'

export const StrategiesSection = memo(function StrategiesSection() {
  const [strategies, setStrategies] = useState<StrategyWithData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStrategies()
  }, [])

  const fetchStrategies = async () => {
    try {
      setLoading(true)
      const data = await strategyApi.getAllStrategies()

      const strategiesWithData: StrategyWithData[] = data.map((strategy) => ({
        ...strategy,
        performance: null,
        equityCurve: null,
        chartSeries: [],
        loadingPerf: true,
      }))

      setStrategies(strategiesWithData)
      setError(null)

      const enriched = await Promise.all(
        strategiesWithData.map(async (strategy) => {
          const [perfResult, curveResult, tradesResult] =
            await Promise.allSettled([
              strategyApi.getStrategyPerformance(strategy.id),
              strategyApi.getEquityCurve(strategy.id, 365),
              strategyApi.getStrategyTrades(strategy.id, 300, 0),
            ])

          const performance =
            perfResult.status === 'fulfilled' ? perfResult.value : null
          const equityCurve =
            curveResult.status === 'fulfilled'
              ? normalizeEquityCurve(curveResult.value)
              : []
          const trades =
            tradesResult.status === 'fulfilled'
              ? tradesResult.value.trades
              : []

          if (perfResult.status === 'rejected') {
            console.error(
              `Performance failed for ${strategy.id}:`,
              perfResult.reason
            )
          }
          if (curveResult.status === 'rejected') {
            console.error(
              `Equity curve failed for ${strategy.id}:`,
              curveResult.reason
            )
          }

          const chartSeries = resolveChartSeries(
            equityCurve.length > 0 ? equityCurve : null,
            trades,
            performance
          )

          return {
            ...strategy,
            performance,
            equityCurve: equityCurve.length > 0 ? equityCurve : null,
            chartSeries,
            loadingPerf: false,
          }
        })
      )

      setStrategies(enriched)
    } catch (err) {
      console.error('Failed to fetch strategies:', err)
      setError(err instanceof Error ? err.message : 'Failed to load strategies')
      setStrategies([])
    } finally {
      setLoading(false)
    }
  }

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

      {loading && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading strategies...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 py-12 text-center">
          <p className="mb-3 text-destructive">{error}</p>
          <button
            onClick={fetchStrategies}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && strategies.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {strategies.map((strategy, i) => (
            <StrategyCard key={strategy.id} strategy={strategy} index={i} />
          ))}
        </div>
      )}

      {!loading && !error && strategies.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No strategies available</p>
        </div>
      )}
    </section>
  )
})
