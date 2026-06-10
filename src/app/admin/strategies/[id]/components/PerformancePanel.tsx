'use client';

import { StrategyMetrics, toNum } from '@/lib/api/strategyApi';

interface PerformancePanelProps {
  metrics: StrategyMetrics;
  loading?: boolean;
}

const goldBorder =
  'border-[rgba(200,160,60,0.28)] dark:border-[rgba(200,160,60,0.15)]';
const cardClass = `p-4 rounded-[14px] bg-card ${goldBorder}`;
const panelClass = `mb-6 p-6 rounded-[18px] bg-card ${goldBorder}`;

export default function PerformancePanel({
  metrics,
  loading = false,
}: PerformancePanelProps) {
  const formatCurrency = (raw: string) => {
    const value = toNum(raw);
    const sign = value < 0 ? '-' : '';
    return `${sign}$${Math.abs(value).toFixed(2)}`;
  };

  const formatPercent = (raw: string) => {
    const value = toNum(raw);
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatNumber = (raw: string | number) => {
    const value = typeof raw === 'number' ? raw : toNum(raw);
    return value.toFixed(2);
  };

  const MetricCard = ({
    label,
    display,
    numeric,
    isPositive,
  }: {
    label: string;
    display: string;
    numeric: number;
    isPositive?: boolean;
  }) => {
    const shouldHighlight =
      isPositive === undefined ? true : isPositive === (numeric > 0);

    return (
      <div className={cardClass}>
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-1.5">
          {label}
        </p>
        <p
          className={`font-outfit text-lg font-semibold tracking-[-0.02em] ${
            shouldHighlight
              ? numeric > 0
                ? 'text-primary'
                : numeric < 0
                  ? 'text-red-600 dark:text-[#ff8a8a]'
                  : 'text-foreground'
              : 'text-foreground'
          }`}
        >
          {display}
        </p>
      </div>
    );
  };

  return (
    <div className={`${panelClass} opacity-0 animate-[fadeUp_0.55s_ease_0.12s_both]`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-[24px] font-light text-foreground">
          Performance metrics
        </h2>
        {loading && (
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
            Updating...
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricCard
          label="Return"
          display={formatPercent(metrics.returnPct)}
          numeric={toNum(metrics.returnPct)}
          isPositive
        />
        <MetricCard
          label="Net P&L"
          display={formatCurrency(metrics.netPnl)}
          numeric={toNum(metrics.netPnl)}
          isPositive
        />
        <MetricCard
          label="Win Rate"
          display={formatPercent(metrics.winRatePct)}
          numeric={toNum(metrics.winRatePct)}
          isPositive
        />
        <MetricCard
          label="Profit Factor"
          display={formatNumber(metrics.profitFactor)}
          numeric={toNum(metrics.profitFactor)}
          isPositive
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Trades"
          display={String(metrics.totalTrades)}
          numeric={metrics.totalTrades}
          isPositive
        />
        <MetricCard
          label="Trades / Month"
          display={formatNumber(metrics.tradesPerMonth)}
          numeric={toNum(metrics.tradesPerMonth)}
          isPositive
        />
        <MetricCard
          label="Max Drawdown"
          display={formatPercent(metrics.maxDrawdownPct)}
          numeric={toNum(metrics.maxDrawdownPct)}
          isPositive={false}
        />
      </div>
    </div>
  );
}
