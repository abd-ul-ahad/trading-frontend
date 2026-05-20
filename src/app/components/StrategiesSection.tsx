'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { memo } from 'react'
import Link from 'next/link'
import {
  strategyApi,
  Strategy,
  StrategyPerformance,
  EquityCurvePoint,
} from '@/lib/api/strategyApi'

interface StrategyWithData extends Strategy {
  performance: StrategyPerformance | null
  equityCurve: EquityCurvePoint[] | null
  loadingPerf: boolean
}

const StrategyCard = memo(
  ({ strategy, index }: { strategy: StrategyWithData; index: number }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: index * 0.07 }}
        className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/50 transition-colors"
      >
        {/* Strategy name */}
        <div>
          <p className="text-[19px] font-bold text-foreground">{strategy.name}</p>
        </div>

        {/* Description */}
        {strategy.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {strategy.description}
          </p>
        )}

        {/* Status badge */}
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              strategy.status === 'active'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
            }`}
          >
            {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
          </span>
        </div>

        {/* Performance metrics */}
        {strategy.performance ? (
          <div className="grid grid-cols-2 gap-2 py-2 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground">Total Return</p>
              <p
                className={`text-sm font-bold ${
                  strategy.performance.totalReturn > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {strategy.performance.totalReturn > 0 ? '+' : ''}
                {strategy.performance.totalReturn.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Win Rate</p>
              <p className="text-sm font-bold text-foreground">
                {(strategy.performance.winRate * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Trades</p>
              <p className="text-sm font-bold text-foreground">
                {strategy.performance.totalTrades}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Drawdown</p>
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                {strategy.performance.maxDrawdown.toFixed(2)}%
              </p>
            </div>
          </div>
        ) : strategy.loadingPerf ? (
          <div className="py-2 text-center">
            <p className="text-xs text-muted-foreground">Loading metrics...</p>
          </div>
        ) : null}

        {/* Capital info */}
        <div className="pt-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Initial Capital
          </p>
          <p className="text-[17px] font-bold text-foreground">
            ${strategy.initial_capital.toLocaleString()}
          </p>
        </div>

        {/* Created date */}
        <div className="text-xs text-muted-foreground">
          Created: {new Date(strategy.createdAt).toLocaleDateString()}
        </div>

        {/* View button */}
        <Link
          href={`/admin/strategies/${strategy.id}`}
          className="mt-auto px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium text-center"
        >
          View Details →
        </Link>
      </motion.div>
    )
  }
)

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

      // Initialize with loading states
      const strategiesWithData: StrategyWithData[] = data.map((strategy) => ({
        ...strategy,
        performance: null,
        equityCurve: null,
        loadingPerf: true,
      }))

      setStrategies(strategiesWithData)
      setError(null)

      // Fetch performance and equity curve for each strategy
      strategiesWithData.forEach((strategy, index) => {
        Promise.all([
          strategyApi.getStrategyPerformance(strategy.id),
          strategyApi.getEquityCurve(strategy.id, 60),
        ])
          .then(([performance, equityCurve]) => {
            setStrategies((prev) => {
              const updated = [...prev]
              updated[index] = {
                ...updated[index],
                performance,
                equityCurve,
                loadingPerf: false,
              }
              return updated
            })
          })
          .catch((err) => {
            console.error(`Failed to load data for strategy ${strategy.id}:`, err)
            setStrategies((prev) => {
              const updated = [...prev]
              updated[index] = {
                ...updated[index],
                loadingPerf: false,
              }
              return updated
            })
          })
      })
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
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
          Trading Strategies
        </p>
        <h2 className="mb-2 text-3xl font-bold text-foreground md:text-[42px]">
          Available Strategies
        </h2>
        <p className="text-[15px] text-muted-foreground">
          Browse our collection of active trading strategies.
        </p>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading strategies...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12 bg-destructive/10 rounded-lg border border-destructive/20">
          <p className="text-destructive mb-3">{error}</p>
          <button
            onClick={fetchStrategies}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && strategies.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy, i) => (
            <StrategyCard key={strategy.id} strategy={strategy} index={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && strategies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No strategies available</p>
        </div>
      )}
    </section>
  )
})
