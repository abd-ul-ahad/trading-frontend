'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { strategyApi, Strategy } from '@/lib/api/strategyApi';
import { formatCurrency } from '@/lib/formatCurrency';

const goldBorder =
  'border-[rgba(200,160,60,0.28)] dark:border-[rgba(200,160,60,0.15)]';
const cardClass = `h-full rounded-[18px] bg-card p-6 flex flex-col gap-4 ${goldBorder}`;
const pageShellClass = 'min-h-screen bg-background text-foreground p-6 pb-20';

export default function AdminDashboard() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      const data = await strategyApi.getAllStrategies();
      setStrategies(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load strategies'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={pageShellClass}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both]">
          <div className="font-mono text-[13px] tracking-[0.22em] uppercase text-primary mb-3 opacity-90">
            Admin
          </div>
          <h1 className="font-display text-[36px] md:text-[44px] font-light text-foreground leading-[1.05] tracking-[-0.015em] mb-2">
            Strategies
          </h1>
          <p className="text-[16px] text-muted-foreground leading-[1.75] max-w-2xl">
            Manage and monitor your trading strategies
          </p>
        </div>

        {error && (
          <div
            className={`mb-6 p-6 rounded-[18px] bg-card ${goldBorder} border-red-300 dark:border-[rgba(239,68,68,0.3)]`}
          >
            <p className="text-red-600 dark:text-[#ff8a8a] mb-4">Error: {error}</p>
            <button
              onClick={fetchStrategies}
              className="px-4 py-2 font-mono text-[13px] tracking-[0.1em] uppercase bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 dark:bg-[rgba(239,68,68,0.15)] dark:border-[rgba(239,68,68,0.35)] dark:text-[#ff8a8a] dark:hover:bg-[rgba(239,68,68,0.25)] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/25 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="font-mono text-[13px] tracking-[0.14em] uppercase text-muted-foreground">
                Loading strategies...
              </p>
            </div>
          </div>
        ) : strategies.length === 0 ? (
          <div className={`text-center p-12 rounded-[18px] bg-card ${goldBorder}`}>
            <p className="text-muted-foreground mb-4">No strategies available</p>
            <button
              onClick={fetchStrategies}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
              <Link
                key={strategy.id}
                href={`/admin/strategies/${strategy.id}`}
                className="group block"
              >
                <div
                  className={`${cardClass} transition-all hover:border-[rgba(200,160,60,0.45)] dark:hover:border-[rgba(200,160,60,0.35)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] hover:-translate-y-0.5`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[22px] font-light text-foreground group-hover:text-primary transition-colors leading-tight">
                      {strategy.name}
                    </h3>
                    <span
                      className={`shrink-0 font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-1 rounded-full border ${
                        strategy.status === 'active'
                          ? 'text-primary border-primary/35 bg-primary/10'
                          : 'text-muted-foreground border-border bg-muted dark:text-[#c8c3bb] dark:border-[rgba(255,255,255,0.1)] dark:bg-[rgba(255,255,255,0.04)]'
                      }`}
                    >
                      {strategy.status.charAt(0).toUpperCase() +
                        strategy.status.slice(1)}
                    </span>
                  </div>

                  {strategy.description && (
                    <p className="text-[15px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {strategy.description}
                    </p>
                  )}

                  <div className="space-y-2 py-2 border-y border-border">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                        Initial Capital
                      </span>
                      <span className="font-outfit text-[15px] font-semibold text-foreground">
                        {formatCurrency(strategy.initial_capital)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                        Created
                      </span>
                      <span className="text-[15px] text-foreground">
                        {new Date(strategy.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span className="mt-auto w-full block text-center px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-[15px] font-medium">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
