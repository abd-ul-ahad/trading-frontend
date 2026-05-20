'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  strategyApi,
  Strategy,
  StrategyPerformance,
  Trade,
  EquityCurvePoint,
} from '@/lib/api/strategyApi';
import PerformancePanel from './components/PerformancePanel';
import TradeHistoryTable from './components/TradeHistoryTable';
import EquityCurveChart from './components/EquityCurveChart';

interface Props {
  params: Promise<{ id: string }>;
}

export default function StrategyDetailsPage({ params }: Props) {
  const { id } = use(params);

  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [performance, setPerformance] = useState<StrategyPerformance | null>(
    null
  );
  const [trades, setTrades] = useState<Trade[]>([]);
  const [totalTrades, setTotalTrades] = useState(0);
  const [equityCurve, setEquityCurve] = useState<EquityCurvePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tradesPage, setTradesPage] = useState(0);
  const tradesPerPage = 50;

  // Load initial data
  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  // Auto-refresh performance every 30 seconds
  useEffect(() => {
    if (id) {
      const interval = setInterval(() => {
        fetchPerformance();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [id]);

  // Load trades when page changes
  useEffect(() => {
    if (id) {
      fetchTrades();
    }
  }, [id, tradesPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [strategyData, performanceData, equityCurveData] =
        await Promise.all([
          strategyApi.getStrategyById(id),
          strategyApi.getStrategyPerformance(id),
          strategyApi.getEquityCurve(id, 60),
        ]);

      setStrategy(strategyData);
      setPerformance(performanceData);
      setEquityCurve(equityCurveData);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load strategy data'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    if (!id) return;
    try {
      setPerformanceLoading(true);
      const data = await strategyApi.getStrategyPerformance(id);
      setPerformance(data);
    } catch (err) {
      console.error('Failed to fetch performance:', err);
    } finally {
      setPerformanceLoading(false);
    }
  };

  const fetchTrades = async () => {
    if (!id) return;
    try {
      const offset = tradesPage * tradesPerPage;
      const data = await strategyApi.getStrategyTrades(
        id,
        tradesPerPage,
        offset,
        'closed'
      );
      setTrades(data.trades);
      setTotalTrades(data.total);
    } catch (err) {
      console.error('Failed to fetch trades:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading strategy details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/admin/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 mb-4">
              Error: {error || 'Strategy not found'}
            </p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalTrades / tradesPerPage);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {strategy.name}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                strategy.status === 'active'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
              }`}
            >
              {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {strategy.description}
          </p>
        </div>

        {/* Strategy Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Account ID
            </p>
            <p className="text-sm font-mono text-slate-900 dark:text-slate-100 truncate">
              {strategy.account_id}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Initial Capital
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              ${strategy.initial_capital.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Created
            </p>
            <p className="text-slate-900 dark:text-slate-100">
              {new Date(strategy.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Performance Panel */}
        {performance && (
          <PerformancePanel
            performance={performance}
            loading={performanceLoading}
          />
        )}

        {/* Equity Curve */}
        {equityCurve.length > 0 && (
          <div className="mb-6">
            <EquityCurveChart data={equityCurve} />
          </div>
        )}

        {/* Trades Table */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Trade History
            </h2>
          </div>

          <TradeHistoryTable trades={trades} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setTradesPage(Math.max(0, tradesPage - 1))}
                disabled={tradesPage === 0}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {tradesPage + 1} of {totalPages} (Total: {totalTrades}{' '}
                trades)
              </span>
              <button
                onClick={() =>
                  setTradesPage(Math.min(totalPages - 1, tradesPage + 1))
                }
                disabled={(tradesPage + 1) * tradesPerPage >= totalTrades}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
