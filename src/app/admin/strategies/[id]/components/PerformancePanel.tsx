'use client';

import { StrategyPerformance } from '@/lib/api/strategyApi';

interface PerformancePanelProps {
  performance: StrategyPerformance;
  loading?: boolean;
}

export default function PerformancePanel({
  performance,
  loading = false,
}: PerformancePanelProps) {
  const formatCurrency = (value: number) => {
    const sign = value < 0 ? '-' : '';
    return `${sign}$${Math.abs(value).toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    const sign = value < 0 ? '-' : '';
    return `${sign}${Math.abs(value).toFixed(2)}%`;
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
    const formattedValue = isCurrency ? formatCurrency(value) : formatPercent(value);
    const shouldHighlight =
      isPositive === undefined ? true : isPositive === (value > 0);

    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">
          {label}
        </p>
        <p
          className={`text-lg font-semibold ${
            shouldHighlight
              ? value > 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {formattedValue}
        </p>
      </div>
    );
  };

  return (
    <div className="mb-6 p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Performance Metrics
        </h2>
        {loading && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Updating...
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard
          label="Total Return"
          value={performance.totalReturn}
          isCurrency={false}
        />
        <MetricCard
          label="Total P&L"
          value={performance.totalPnL}
          isCurrency={true}
        />
        <MetricCard
          label="Unrealized P&L"
          value={performance.unrealizedPnL}
          isCurrency={true}
        />
        <MetricCard
          label="Realized P&L"
          value={performance.realizedPnL}
          isCurrency={true}
        />
        <MetricCard
          label="Win Rate"
          value={performance.winRate * 100}
          isPositive={true}
          isCurrency={false}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Trades"
          value={performance.totalTrades}
          isPositive={true}
          isCurrency={false}
        />
        <MetricCard
          label="Winning Trades"
          value={performance.winningTrades}
          isPositive={true}
          isCurrency={false}
        />
        <MetricCard
          label="Losing Trades"
          value={performance.losingTrades}
          isPositive={false}
          isCurrency={false}
        />
        <MetricCard
          label="Max Drawdown"
          value={performance.maxDrawdown}
          isPositive={false}
          isCurrency={false}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          label="Current Drawdown"
          value={performance.currentDrawdown}
          isCurrency={false}
        />
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wide">
            Last Updated
          </p>
          <p className="text-sm text-slate-900 dark:text-white">
            {new Date(performance.lastUpdated).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
