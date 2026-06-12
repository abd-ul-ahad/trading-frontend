'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  portfolioApi,
  PortfolioResponse,
  PortfolioTimeframe,
} from '@/lib/api/portfolioApi';
import {
  PortfolioChart,
  type PortfolioCustomRange,
} from './PortfolioChart';

function defaultCustomRange(): PortfolioCustomRange {
  const now = new Date();
  const from = new Date(now.getFullYear(), 0, 1);
  return {
    from: from.toISOString().slice(0, 10),
    to: now.toISOString().slice(0, 10),
  };
}

function formatAsOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function portfolioSubtitle(data: PortfolioResponse): string {
  const n = data.nStrategies;
  const strategyLabel = n === 1 ? '1 strategy' : `${n} strategies`;
  const pct = data.change.pct;
  if (pct > 0) {
    return `Your portfolio is up across all ${strategyLabel}.`;
  }
  if (pct < 0) {
    return `Your portfolio is down across ${strategyLabel}.`;
  }
  return `Tracking performance across ${strategyLabel}.`;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PortfolioTimeframe>('1W');
  const [customRange, setCustomRange] = useState<PortfolioCustomRange>(
    defaultCustomRange
  );

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const params: Parameters<typeof portfolioApi.getPortfolio>[0] = {
        timeframe: period,
      };
      if (period === 'CUSTOM') {
        params.from = new Date(customRange.from).toISOString();
        params.to = new Date(`${customRange.to}T23:59:59.999`).toISOString();
      }
      const data = await portfolioApi.getPortfolio(params);
      setPortfolio(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch portfolio:', err);
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, [period, customRange]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handlePeriodChange = (next: PortfolioTimeframe) => {
    setPeriod(next);
  };

  const handleCustomRangeChange = (range: PortfolioCustomRange) => {
    if (!range.from || !range.to || range.from > range.to) return;
    setCustomRange(range);
  };

  const greetingName = portfolio?.greetingName ?? 'there';
  const timestamp = portfolio ? formatAsOf(portfolio.asOf) : '';

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-[calc(68px+50px+44px)] md:px-8 lg:px-16">
      <div className="mb-8 flex flex-col justify-between gap-4 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both] md:flex-row md:items-baseline">
        <div>
          <div className="font-display text-[32px] font-light tracking-[-0.01em] text-white md:text-[50px]">
            Good morning, <em className="italic">{greetingName}.</em>
          </div>
          <div className="mt-1 font-mono uppercase tracking-[0.14em] text-[#c8c3bb] md:text-[14px]">
            {portfolio
              ? portfolioSubtitle(portfolio)
              : 'Loading your portfolio…'}
          </div>
        </div>
        {timestamp && (
          <div className="font-mono text-[15px] uppercase tracking-[0.12em] text-[#c8c3bb]">
            {timestamp}
          </div>
        )}
      </div>

      <PortfolioChart
        data={portfolio}
        loading={loading}
        error={error}
        period={period}
        customRange={customRange}
        onPeriodChange={handlePeriodChange}
        onCustomRangeChange={handleCustomRangeChange}
        onRetry={fetchPortfolio}
      />
    </main>
  );
}
