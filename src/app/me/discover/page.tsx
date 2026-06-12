'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  StrategyListItem,
  strategyApi,
  toNum,
} from '@/lib/api/strategyApi';
import { FollowStrategyModal } from './FollowStrategyModal';

type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Aggressive';

const riskConfig: Record<RiskLevel, { color: string; dots: number; bg: string }> = {
  Low:        { color: '#d4af37', dots: 1, bg: 'rgba(212,175,55,0.12)' },
  Moderate:   { color: '#60a5fa', dots: 2, bg: 'rgba(96,165,250,0.12)' },
  High:       { color: '#f59e0b', dots: 3, bg: 'rgba(245,158,11,0.12)' },
  Aggressive: { color: '#ef4444', dots: 4, bg: 'rgba(239,68,68,0.12)'  },
};

function riskFromLevel(level: number): RiskLevel {
  if (level <= 1) return 'Low';
  if (level === 2) return 'Moderate';
  if (level === 3) return 'High';
  return 'Aggressive';
}

function formatPctString(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'string' && value.includes('%')) return value;
  const n = toNum(value);
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
}

function sparklineToChart(sparkline: number[]) {
  return sparkline.map((v, i) => ({ i, equity: toNum(v) }));
}

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: { value: number; payload: { i: number } }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs shadow-lg">
        <p className="text-muted-foreground">{payload[0].payload.i}</p>
        <p className="font-semibold text-foreground">
          Equity : ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const StrategyCard = ({
  strategy,
  index,
  onJoin,
}: {
  strategy: StrategyListItem;
  index: number;
  onJoin: (strategy: StrategyListItem) => void;
}) => {
  const risk = riskFromLevel(strategy.riskLevel);
  const cfg = riskConfig[risk];
  const data = useMemo(
    () => sparklineToChart(strategy.sparkline),
    [strategy.sparkline]
  );

  const returnPct = formatPctString(strategy.returnPct);
  const drawdown = formatPctString(strategy.maxDrawdownPct);

  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 opacity-0"
      style={{ animation: `fadeUp 0.5s ease ${0.15 + index * 0.05}s both` }}
    >
      <p className="text-[19px] font-bold text-foreground">
        {strategy.displayName}
      </p>

      <div className="mb-2 grid grid-cols-3 gap-2">
        {[
          { label: 'Return', value: returnPct, accent: true },
          { label: 'Drawdown', value: drawdown },
          { label: 'Capital', value: '—' },
        ].map((s) => (
          <div key={s.label}>
            <p className="mb-0.5 text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
            <p
              className={`text-[17px] font-bold ${s.accent ? 'text-primary' : 'text-foreground'}`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="mb-0.5 text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
            YTD Return
          </p>
          <p className="text-[17px] font-semibold text-primary">{returnPct}</p>
        </div>
        <div>
          <p className="mb-0.5 text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
            Since Inception
          </p>
          <p className="text-[17px] font-semibold text-primary">{returnPct}</p>
        </div>
        <div>
          <p className="mb-0.5 text-[13px] font-medium uppercase tracking-wider text-muted-foreground">
            Max DD
          </p>
          <p className="text-[17px] font-semibold text-foreground">{drawdown}</p>
        </div>
      </div>

      <div className="h-16 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${strategy.publicCode}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="#d4af37"
                strokeWidth={1.5}
                fill={`url(#grad-${strategy.publicCode})`}
                dot={false}
                activeDot={{ r: 4, fill: '#d4af37', stroke: '#0a0a0a', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No chart data
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-2">
        <span className="text-[13px] font-medium text-muted-foreground">Risk:</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: cfg.dots }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: cfg.color }}
            />
          ))}
          {Array.from({ length: 4 - cfg.dots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-3 w-3 rounded-full border-2"
              style={{ borderColor: cfg.color, backgroundColor: 'transparent' }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onJoin(strategy)}
        className="font-outfit w-full rounded-lg bg-gradient-to-r from-[#d4af37] via-[#e8c84a] to-[#f5e090] px-5 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-black transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(212,175,55,0.35)]"
      >
        Join this strategy
      </button>
    </div>
  );
};

export default function DiscoverPage() {
  const [strategies, setStrategies] = useState<StrategyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinStrategy, setJoinStrategy] = useState<StrategyListItem | null>(null);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      const data = await strategyApi.getAllStrategies();
      setStrategies(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch strategies:', err);
      setError(err instanceof Error ? err.message : 'Failed to load strategies');
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const count = strategies.length;

  return (
    <main className="px-4 pb-20 pt-[calc(68px+50px+44px)] md:px-8 lg:px-24">
      <div className="mb-6 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both] md:mb-8">
        <div className="font-display text-[32px] font-light tracking-[-0.01em] text-white md:text-[50px]">
          Discover new <em className="italic">strategies.</em>
        </div>
        <div className="mt-1 font-mono uppercase tracking-[0.14em] text-[#c8c3bb] md:text-[14px]">
          {loading
            ? 'Loading verified strategies…'
            : `${count} verified ${count === 1 ? 'strategy' : 'strategies'} available for investment`}
        </div>
      </div>

      {loading && (
        <div className="py-16 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading strategies...</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 py-12 text-center">
          <p className="mb-3 text-destructive">{error}</p>
          <button
            type="button"
            onClick={fetchStrategies}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && strategies.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No strategies available</p>
        </div>
      )}

      {!loading && strategies.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {strategies.map((strategy, i) => (
            <StrategyCard
              key={strategy.publicCode}
              strategy={strategy}
              index={i}
              onJoin={setJoinStrategy}
            />
          ))}
        </div>
      )}

      <FollowStrategyModal
        strategy={joinStrategy}
        open={joinStrategy !== null}
        onClose={() => setJoinStrategy(null)}
      />
    </main>
  );
}
