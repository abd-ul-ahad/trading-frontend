'use client';

import { StrategyPerformance } from '@/lib/api/strategyApi';

interface PerformancePanelProps {
  performance: StrategyPerformance;
  loading?: boolean;
}

const goldBorder =
  'border-[rgba(200,160,60,0.28)] dark:border-[rgba(200,160,60,0.15)]';
const cardClass = `p-4 rounded-[14px] bg-card ${goldBorder}`;
const panelClass = `mb-6 p-6 rounded-[18px] bg-card ${goldBorder}`;

// Backend serializes numeric/decimal columns as JSON strings; coerce so
// `.toFixed()` and numeric comparisons work regardless of arrival type.
const toNum = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function PerformancePanel({
  performance,
  loading = false,
}: PerformancePanelProps) {
  const formatCurrency = (raw: number) => {
    const value = toNum(raw);
    const sign = value < 0 ? '-' : '';
    return `${sign}$${Math.abs(value).toFixed(2)}`;
  };

  const formatPercent = (raw: number) => {
    const value = toNum(raw);
    const sign = value < 0 ? '-' : '';
    return `${sign}${Math.abs(value).toFixed(2)}%`;
  };

  // Drawdown values come from the backend as positive USD amounts (peak-to-trough).
  // Render with a leading minus so the UI still communicates "down from peak".
  const formatDrawdown = (raw: number) => {
    const usd = toNum(raw);
    return usd === 0 ? '$0.00' : `-$${Math.abs(usd).toFixed(2)}`;
  };

  const DrawdownCard = ({ label, value }: { label: string; value: number }) => {
    const numeric = toNum(value);
    return (
      <div className={cardClass}>
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-1.5">
          {label}
        </p>
        <p
          className={`font-outfit text-lg font-semibold tracking-[-0.02em] ${
            numeric > 0
              ? 'text-red-600 dark:text-[#ff8a8a]'
              : 'text-foreground'
          }`}
        >
          {formatDrawdown(numeric)}
        </p>
      </div>
    );
  };

  const MetricCard = ({
    label,
    value,
    isPositive,
    isCurrency = false,
  }: {
    label: string;
    value: number;
    isPositive?: boolean;
    isCurrency?: boolean;
  }) => {
    const numeric = toNum(value);
    const formattedValue = isCurrency ? formatCurrency(numeric) : formatPercent(numeric);
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
          {formattedValue}
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
        <MetricCard label="Total P&L" value={performance.totalPnL} isCurrency />
        <MetricCard label="Unrealized P&L" value={performance.unrealizedPnL} isCurrency />
        <MetricCard label="Realized P&L" value={performance.realizedPnL} isCurrency />
        <MetricCard
          label="Win Rate"
          value={performance.winRate * 100}
          isPositive
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MetricCard label="Total Trades" value={performance.totalTrades} isPositive />
        <MetricCard label="Winning Trades" value={performance.winningTrades} isPositive />
        <MetricCard label="Losing Trades" value={performance.losingTrades} isPositive={false} />
        <DrawdownCard label="Max Drawdown" value={performance.maxDrawdown} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DrawdownCard label="Current Drawdown" value={performance.currentDrawdown} />
        <div className={cardClass}>
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-1.5">
            Last Updated
          </p>
          <p className="text-sm text-foreground">
            {new Date(performance.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
