'use client'

import { memo, useEffect, useState } from 'react'
import { strategyApi } from '@/lib/api/strategyApi'

type StatItem = {
  label: string
  value: string
  highlight: boolean
}

export const StatsMarquee = memo(function StatsMarquee() {
  const [activeCount, setActiveCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const strategies = await strategyApi.getAllStrategies()
        if (cancelled) return
        setActiveCount(strategies.filter((s) => s.status === 'active').length)
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

  const stats: StatItem[] = [
    { label: 'Verified on', value: 'MT5', highlight: true },
    { label: 'Avg YTD return', value: '+21.4%', highlight: true },
    { label: activeLabel, value: '', highlight: false },
    { label: '1,240 investors', value: '', highlight: false },
  ]

  return (
    <div className="relative w-full overflow-hidden border-y border-border bg-background py-4 md-5 md:mb-10">
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-content {
          animation: scroll 20s linear infinite;
        }
      `}</style>
      <div className="marquee-content flex whitespace-nowrap">
        {/* Duplicate the content twice for seamless loop */}
        {[...stats, ...stats, ...stats, ...stats].map((stat, index) => (
          <div key={index} className="mx-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest">
            <span className="text-muted-foreground">{stat.label}</span>
            {stat.value && (
              <span className={stat.highlight ? 'font-semibold text-primary' : 'text-foreground'}>
                {stat.value}
              </span>
            )}
            <span className="text-muted-foreground">•</span>
          </div>
        ))}
      </div>
    </div>
  )
})
