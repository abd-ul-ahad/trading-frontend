'use client'

import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import {
  PerformanceCurvePoint,
  StrategyListItem,
  StrategyMetrics,
  StrategyTimeframe,
  toNum,
  strategyApi,
} from '@/lib/api/strategyApi'

type ChartPoint = { i: number; equity: number }

export type ChartPeriod = StrategyTimeframe

export type CustomDateRange = {
  from: string
  to: string
}

function defaultCustomRange(): CustomDateRange {
  const now = new Date()
  const from = new Date(now.getFullYear(), 0, 1)
  return {
    from: from.toISOString().slice(0, 10),
    to: now.toISOString().slice(0, 10),
  }
}

function sparklineToSeries(sparkline: number[]): ChartPoint[] {
  return sparkline.map((v, i) => ({ i, equity: toNum(v) }))
}

function curveToSeries(curve: PerformanceCurvePoint[]): ChartPoint[] {
  return curve.map((p, i) => ({ i, equity: toNum(p.v) }))
}

function filterCurveByDateRange(
  curve: PerformanceCurvePoint[],
  from: string,
  to: string
): PerformanceCurvePoint[] {
  const start = new Date(from).setHours(0, 0, 0, 0)
  const end = new Date(to).setHours(23, 59, 59, 999)
  const filtered = curve.filter((p) => {
    const ts = new Date(p.t).getTime()
    return Number.isFinite(ts) && ts >= start && ts <= end
  })
  return filtered.length >= 2 ? filtered : curve
}

function formatSince(dateStr: string): string {
  const d = new Date(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${mm}/${yyyy}`
}

function formatPct(value: number | null): string {
  if (value === null) return '—'
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

function formatMaxDdPct(value: string | null): string {
  if (value === null) return '—'
  const n = toNum(value)
  return `${n.toFixed(1)}%`
}

function formatTradesPerMonth(value: string | null): string {
  if (value === null) return '—'
  return String(Math.round(toNum(value)))
}

function formatWinRate(value: string | null): string {
  if (value === null) return '—'
  return `${toNum(value).toFixed(1)}%`
}

const STRATEGY_COLORS = [
  '#d4af37',
  '#6ee7b7',
  '#60a5fa',
  '#f472b6',
  '#a78bfa',
  '#fb923c',
] as const

const PERIODS: readonly ChartPeriod[] = [
  '1D',
  '1W',
  '1M',
  '3M',
  '6M',
  'YTD',
  '1Y',
  'ALL',
  'CUSTOM',
] as const

const PERIOD_LABEL: Record<ChartPeriod, string> = {
  '1D': '1D',
  '1W': '1W',
  '1M': '1M',
  '3M': '3M',
  '6M': '6M',
  YTD: 'YTD',
  '1Y': '1Y',
  ALL: 'ALL',
  CUSTOM: 'Custom',
}

const RETURN_LABEL: Record<ChartPeriod, string> = {
  '1D': '1D Return',
  '1W': '1W Return',
  '1M': '1M Return',
  '3M': '3M Return',
  '6M': '6M Return',
  YTD: 'YTD Return',
  '1Y': '1Y Return',
  ALL: 'Return',
  CUSTOM: 'Return',
}

export interface StrategyWithData extends StrategyListItem {
  chartSeries: ChartPoint[]
  loadingPerf: boolean
  chartPeriod: ChartPeriod
  customRange: CustomDateRange
  displayMetrics: {
    returnPct: string
    maxDrawdownPct: string
    winRatePct: string
    tradesPerMonth: string
  }
}

function metricsFromList(item: StrategyListItem): StrategyWithData['displayMetrics'] {
  return {
    returnPct: item.returnPct,
    maxDrawdownPct: item.maxDrawdownPct,
    winRatePct: item.winRatePct,
    tradesPerMonth: item.tradesPerMonth,
  }
}

function metricsFromResponse(metrics: StrategyMetrics): StrategyWithData['displayMetrics'] {
  return {
    returnPct: metrics.returnPct,
    maxDrawdownPct: metrics.maxDrawdownPct,
    winRatePct: metrics.winRatePct,
    tradesPerMonth: metrics.tradesPerMonth,
  }
}

function listItemToStrategyWithData(item: StrategyListItem): StrategyWithData {
  return {
    ...item,
    chartSeries: sparklineToSeries(item.sparkline),
    loadingPerf: false,
    chartPeriod: 'YTD',
    customRange: defaultCustomRange(),
    displayMetrics: metricsFromList(item),
  }
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
  color,
  chartKey,
}: {
  strategyId: string
  chartData: { i: number; equity: number }[]
  color: string
  chartKey: string
}) {
  const gradientId = `strat-grad-${strategyId}`

  return (
    <div className="h-[88px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          key={chartKey}
          data={chartData}
          margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="equity"
            stroke={color}
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
  onPeriodChange,
  onCustomRangeChange,
}: {
  strategy: StrategyWithData
  index: number
  onPeriodChange: (publicCode: string, period: ChartPeriod) => void
  onCustomRangeChange: (publicCode: string, range: CustomDateRange) => void
}) {
  const strategyColor = STRATEGY_COLORS[index % STRATEGY_COLORS.length]
  const chartData = strategy.chartSeries
  const metrics = strategy.displayMetrics

  const returnPct = toNum(metrics.returnPct)
  const returnLabel = formatPct(returnPct)
  const maxDdLabel = formatMaxDdPct(metrics.maxDrawdownPct)
  const winRateLabel = formatWinRate(metrics.winRatePct)
  const tradesPerMonthLabel = formatTradesPerMonth(metrics.tradesPerMonth)
  const maxDdIsNegative = toNum(metrics.maxDrawdownPct) < 0
  const chartKey = `${strategy.publicCode}:${strategy.chartPeriod}:${chartData.length}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a] p-6 md:p-7 transition-colors hover:border-[rgba(255,255,255,0.13)]"
    >
      <div className="mb-4 flex justify-end gap-1">
        {[1, 2, 3, 4].map((pip) => (
          <div
            key={pip}
            className={`h-1.5 w-1.5 rounded-full ${
              pip <= strategy.riskLevel
                ? 'bg-[rgba(200,160,60,0.65)]'
                : 'bg-[rgba(255,255,255,0.1)]'
            }`}
          />
        ))}
      </div>

      <h3 className="font-display mb-3 text-[28px] font-normal leading-[1.1] tracking-[-0.01em] text-white md:text-[30px]">
        {strategy.displayName}
      </h3>

      <p className="font-outfit mb-5 text-[14px] leading-[1.75] text-[#a39b93]">
        {strategy.description ?? 'No description available.'}
      </p>

      <div className="mb-5 border-b border-[rgba(255,255,255,0.05)] pb-5">
        <div className="mb-3 flex flex-col items-end gap-2">
          <div className="flex max-w-full flex-wrap items-center justify-end gap-1 rounded-full border border-[rgba(255,255,255,0.10)] bg-[#0a0a0a] p-1">
            {PERIODS.map((p) => {
              const active = p === strategy.chartPeriod
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPeriodChange(strategy.publicCode, p)}
                  className={[
                    'cursor-pointer rounded-full px-2 py-1 text-[10px] font-semibold tracking-wide transition-colors sm:px-2.5 sm:text-[11px]',
                    active
                      ? 'bg-[rgba(255,255,255,0.10)] text-white'
                      : 'text-[#a39b93] hover:text-white',
                  ].join(' ')}
                  aria-pressed={active}
                >
                  {PERIOD_LABEL[p]}
                </button>
              )
            })}
          </div>

          <div
            className={[
              'flex w-full flex-wrap items-center justify-end gap-2 transition-all',
              strategy.chartPeriod === 'CUSTOM'
                ? 'max-h-20 opacity-100'
                : 'max-h-0 overflow-hidden opacity-0',
            ].join(' ')}
          >
            <input
              type="date"
              value={strategy.customRange.from}
              max={strategy.customRange.to}
              onChange={(e) =>
                onCustomRangeChange(strategy.publicCode, {
                  ...strategy.customRange,
                  from: e.target.value,
                })
              }
              className="cursor-pointer rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-[#d8d3ca] outline-none focus:border-[rgba(200,160,60,0.4)]"
            />
            <span className="font-mono text-[10px] text-[#8a847c]">→</span>
            <input
              type="date"
              value={strategy.customRange.to}
              min={strategy.customRange.from}
              onChange={(e) =>
                onCustomRangeChange(strategy.publicCode, {
                  ...strategy.customRange,
                  to: e.target.value,
                })
              }
              className="cursor-pointer rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-[#d8d3ca] outline-none focus:border-[rgba(200,160,60,0.4)]"
            />
          </div>
        </div>

        {chartData.length > 0 ? (
          <motion.div
            key={chartKey}
            initial={{ opacity: 0.0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="relative"
          >
            <div className={strategy.loadingPerf ? 'opacity-60' : 'opacity-100'}>
              <StrategyMiniChart
                strategyId={strategy.publicCode}
                chartData={chartData}
                color={strategyColor}
                chartKey={chartKey}
              />
            </div>

            {strategy.loadingPerf && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                  style={{ borderColor: strategyColor }}
                />
              </div>
            )}
          </motion.div>
        ) : strategy.loadingPerf ? (
          <div className="flex h-[88px] items-center justify-center">
            <div
              className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
              style={{ borderColor: strategyColor }}
            />
          </div>
        ) : (
          <div className="flex h-[88px] items-center justify-center">
            <p className="font-outfit text-[13px] text-[#8a847c]">No chart data yet</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
        <StatCell
          label={RETURN_LABEL[strategy.chartPeriod]}
          value={strategy.loadingPerf ? '…' : returnLabel}
          valueClassName={
            returnPct >= 0 ? 'text-[#7EFFA8]' : 'text-[#ff7e7e]'
          }
        />
        <StatCell
          label="Max DD"
          value={strategy.loadingPerf ? '…' : maxDdLabel}
          valueClassName={maxDdIsNegative ? 'text-[#e89999]' : 'text-white'}
        />
        <StatCell
          label="Win rate %"
          value={strategy.loadingPerf ? '…' : winRateLabel}
          valueClassName="text-white"
        />
        <StatCell label="Since" value={formatSince(strategy.activeSince)} />
        <StatCell
          label="Trades/Mo"
          value={strategy.loadingPerf ? '…' : tradesPerMonthLabel}
        />
      </div>
    </motion.div>
  )
})

StrategyCard.displayName = 'StrategyCard'

export const StrategiesGrid = memo(function StrategiesGrid({
  gridClassName = 'grid grid-cols-1 gap-5 sm:grid-cols-2',
  max,
}: {
  gridClassName?: string
  max?: number
}) {
  const [strategies, setStrategies] = useState<StrategyWithData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStrategies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadPerformance = async (
    strategy: StrategyWithData,
    period: ChartPeriod,
    customRange?: CustomDateRange
  ): Promise<StrategyWithData> => {
    const range = customRange ?? strategy.customRange
    const timeframe: StrategyTimeframe = period === 'CUSTOM' ? 'ALL' : period

    const response = await strategyApi.getStrategyPerformance(
      strategy.publicCode,
      timeframe
    )

    let curve = response.curve
    if (period === 'CUSTOM' && range.from && range.to) {
      curve = filterCurveByDateRange(curve, range.from, range.to)
    }

    return {
      ...strategy,
      chartSeries: curveToSeries(curve),
      displayMetrics: metricsFromResponse(response.metrics),
      loadingPerf: false,
      chartPeriod: period,
      customRange: range,
    }
  }

  const fetchStrategies = async () => {
    try {
      setLoading(true)
      const data = await strategyApi.getAllStrategies()
      setStrategies(data.map(listItemToStrategyWithData))
      setError(null)
    } catch (err) {
      console.error('Failed to fetch strategies:', err)
      setError(err instanceof Error ? err.message : 'Failed to load strategies')
      setStrategies([])
    } finally {
      setLoading(false)
    }
  }

  const refreshStrategy = (
    publicCode: string,
    period: ChartPeriod,
    customRange?: CustomDateRange
  ) => {
    setStrategies((prev) => {
      const base = prev.find((s) => s.publicCode === publicCode)
      if (!base) return prev

      const range = customRange ?? base.customRange
      const nextState = prev.map((s) =>
        s.publicCode === publicCode
          ? { ...s, chartPeriod: period, customRange: range, loadingPerf: true }
          : s
      )

      void loadPerformance({ ...base, customRange: range }, period, range)
        .then((updated) => {
          setStrategies((p) =>
            p.map((s) => (s.publicCode === publicCode ? updated : s))
          )
        })
        .catch((err) => {
          console.error('Failed to update strategy chart period:', err)
          setStrategies((p) =>
            p.map((s) =>
              s.publicCode === publicCode ? { ...s, loadingPerf: false } : s
            )
          )
        })

      return nextState
    })
  }

  const handleCardPeriodChange = (publicCode: string, next: ChartPeriod) => {
    refreshStrategy(publicCode, next)
  }

  const handleCustomRangeChange = (publicCode: string, range: CustomDateRange) => {
    if (!range.from || !range.to || range.from > range.to) return
    refreshStrategy(publicCode, 'CUSTOM', range)
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading strategies...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 py-12 text-center">
        <p className="mb-3 text-destructive">{error}</p>
        <button
          onClick={fetchStrategies}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (strategies.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No strategies available</p>
      </div>
    )
  }

  const shown = max ? strategies.slice(0, max) : strategies

  return (
    <div className={gridClassName}>
      {shown.map((strategy, i) => (
        <StrategyCard
          key={strategy.publicCode}
          strategy={strategy}
          index={i}
          onPeriodChange={handleCardPeriodChange}
          onCustomRangeChange={handleCustomRangeChange}
        />
      ))}
    </div>
  )
})

StrategiesGrid.displayName = 'StrategiesGrid'
