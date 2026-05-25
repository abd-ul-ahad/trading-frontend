'use client';

import { useEffect, useState } from 'react';
import { strategyApi, PublicSummary } from '@/lib/api/strategyApi';

// Backend serializes numeric/decimal columns as JSON strings; coerce defensively.
const toNum = (v: unknown): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function StrategiesShowcase() {
  const [summaries, setSummaries] = useState<PublicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicSummaries();
  }, []);

  const fetchPublicSummaries = async () => {
    try {
      setLoading(true);
      // Fetch all strategies' public summaries
      const strategyIds = [
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
        '550e8400-e29b-41d4-a716-446655440003',
      ];

      const summaryPromises = strategyIds.map((id) =>
        strategyApi.getPublicSummary(id).catch(() => null)
      );

      const results = await Promise.all(summaryPromises);
      const validSummaries = results.filter(
        (summary): summary is PublicSummary => summary !== null
      );

      setSummaries(validSummaries);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load strategies'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading strategies...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-700 dark:text-red-400 mb-4">Error: {error}</p>
        <button
          onClick={fetchPublicSummaries}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600 dark:text-slate-400">
          No strategies available
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {summaries.map((summary) => (
        <div
          key={summary.strategyId}
          className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg transition-all"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {summary.name}
            </h3>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
          </div>

          {(() => {
            const winRate = toNum(summary.winRate);
            const maxDd = toNum(summary.maxDrawdown);
            return (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Win Rate
                  </span>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {(winRate * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Total Trades
                  </span>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">
                    {summary.totalTrades}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Max Drawdown
                  </span>
                  <span
                    className={`text-lg font-semibold ${
                      maxDd > 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {maxDd === 0 ? '$0.00' : `-$${maxDd.toFixed(2)}`}
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Last updated: {new Date(summary.lastUpdated).toLocaleString()}
            </p>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
            View Details →
          </button>
        </div>
      ))}
    </div>
  );
}
