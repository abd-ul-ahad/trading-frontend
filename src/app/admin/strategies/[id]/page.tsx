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

const goldBorder =
  'border-[rgba(200,160,60,0.28)] dark:border-[rgba(200,160,60,0.15)]';
const cardClass = `rounded-[18px] bg-card ${goldBorder}`;
const labelClass =
  'font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground mb-1.5';
const backLinkClass =
  'font-mono text-[13px] tracking-[0.12em] uppercase text-primary hover:text-primary/80 transition-colors';
const pageShellClass = 'min-h-full bg-background text-foreground p-6';

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

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const interval = setInterval(() => {
        fetchPerformance();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [id]);

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
      <div className={`${pageShellClass} flex justify-center items-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/25 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-[13px] tracking-[0.14em] uppercase text-muted-foreground">
            Loading strategy details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !strategy) {
    return (
      <div className={pageShellClass}>
        <div className="max-w-7xl mx-auto">
          <Link href="/admin/dashboard" className={`${backLinkClass} mb-6 inline-block`}>
            ← Back to strategies
          </Link>
          <div className={`p-6 ${cardClass} border-red-300 dark:border-[rgba(239,68,68,0.3)]`}>
            <p className="text-red-600 dark:text-[#ff8a8a] mb-4">
              Error: {error || 'Strategy not found'}
            </p>
            <button
              onClick={loadData}
              className="px-4 py-2 font-mono text-[13px] tracking-[0.1em] uppercase bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 dark:bg-[rgba(239,68,68,0.15)] dark:border-[rgba(239,68,68,0.35)] dark:text-[#ff8a8a] dark:hover:bg-[rgba(239,68,68,0.25)] transition-colors"
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
    <div className={`${pageShellClass} pb-20`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both]">
          <Link href="/admin/dashboard" className={`${backLinkClass} mb-5 inline-block`}>
            ← Back to strategies
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <h1 className="font-display text-[36px] md:text-[44px] font-light text-foreground leading-[1.05] tracking-[-0.015em]">
              {strategy.name}
            </h1>
            <span
              className={`font-mono text-xs tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border ${
                strategy.status === 'active'
                  ? 'text-primary border-primary/35 bg-primary/10'
                  : 'text-muted-foreground border-border bg-muted dark:text-[#c8c3bb] dark:border-[rgba(255,255,255,0.1)] dark:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6 opacity-0 animate-[fadeUp_0.55s_ease_0.1s_both]">
          <div className={`p-5 ${cardClass}`}>
            <p className={labelClass}>Created</p>
            <p className="text-foreground">
              {new Date(strategy.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {performance && (
          <PerformancePanel
            performance={performance}
            loading={performanceLoading}
          />
        )}

        {equityCurve.length > 0 && (
          <div className="mb-6 opacity-0 animate-[fadeUp_0.55s_ease_0.15s_both]">
            <EquityCurveChart data={equityCurve} />
          </div>
        )}

        <div className={`${cardClass} overflow-hidden opacity-0 animate-[fadeUp_0.55s_ease_0.2s_both]`}>
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-[24px] font-light text-foreground">
              Trade history
            </h2>
          </div>

          <TradeHistoryTable trades={trades} />

          {totalPages > 1 && (
            <div className="p-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setTradesPage(Math.max(0, tradesPage - 1))}
                disabled={tradesPage === 0}
                className="px-4 py-2 font-mono text-[13px] tracking-[0.08em] uppercase border border-border text-foreground rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/45 hover:text-primary transition-colors"
              >
                ← Previous
              </button>
              <span className="font-mono text-[12px] tracking-[0.1em] uppercase text-muted-foreground">
                Page {tradesPage + 1} of {totalPages} · {totalTrades} trades
              </span>
              <button
                onClick={() =>
                  setTradesPage(Math.min(totalPages - 1, tradesPage + 1))
                }
                disabled={(tradesPage + 1) * tradesPerPage >= totalTrades}
                className="px-4 py-2 font-mono text-[13px] tracking-[0.08em] uppercase border border-border text-foreground rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary/45 hover:text-primary transition-colors"
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
