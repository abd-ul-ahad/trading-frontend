'use client';

import { useRef, useState } from 'react';
import {
  PORTFOLIO_TIMEFRAMES,
  PortfolioResponse,
  PortfolioTimeframe,
  toNum,
} from '@/lib/api/portfolioApi';

export type PortfolioCustomRange = {
  from: string;
  to: string;
};

interface PortfolioChartProps {
  data: PortfolioResponse | null;
  loading: boolean;
  error: string | null;
  period: PortfolioTimeframe;
  customRange: PortfolioCustomRange;
  onPeriodChange: (period: PortfolioTimeframe) => void;
  onCustomRangeChange: (range: PortfolioCustomRange) => void;
  onRetry: () => void;
}

const W = 1180;
const H = 240;
const PAD = 20;

const PERIOD_LABEL: Record<PortfolioTimeframe, string> = {
  '1D': 'today',
  '1W': 'this week',
  '1M': 'this month',
  '1Q': 'this quarter',
  YTD: 'year to date',
  '1Y': 'past year',
  MAX: 'since start',
  CUSTOM: 'custom range',
};

function buildSVGPath(pts: number[]) {
  if (pts.length < 2) {
    const v = pts[0] ?? 0;
    const y = (H / 2).toFixed(2);
    return {
      line: `M0,${y} L${W},${y}`,
      area: `M0,${y} L${W},${y} L${W},${H} L0,${H} Z`,
      mn: v,
      mx: v,
    };
  }

  const n = pts.length;
  const mn = Math.min(...pts);
  const mx = Math.max(...pts);
  const rng = mx - mn || 1;
  const yOf = (v: number) => PAD + (H - 2 * PAD) * (1 - (v - mn) / rng);
  const xOf = (i: number) => (i / (n - 1)) * W;
  let line = 'M';
  let area = 'M';
  pts.forEach((v, i) => {
    const x = xOf(i).toFixed(2);
    const y = yOf(v).toFixed(2);
    line += (i ? 'L' : '') + x + ',' + y + ' ';
    area += (i ? 'L' : '') + x + ',' + y + ' ';
  });
  area += `L${W},${H} L0,${H} Z`;
  return { line, area, mn, mx };
}

function fmtUSD(v: number) {
  return '$' + Math.round(v).toLocaleString();
}

function fmtSignedUSD(v: number) {
  const sign = v >= 0 ? '+' : '−';
  return sign + fmtUSD(Math.abs(v));
}

function fmtPct(v: number, signed = true) {
  const sign = v >= 0 ? '+' : '−';
  const abs = Math.abs(v).toFixed(2);
  return signed ? `${sign}${abs}%` : `${abs}%`;
}

function fmtK(v: number) {
  if (v >= 1000000) return '$' + (v / 1000000).toFixed(2) + 'M';
  if (v >= 1000) return '$' + (v / 1000).toFixed(0) + 'k';
  return '$' + v;
}

function formatCurveDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function PortfolioChart({
  data,
  loading,
  error,
  period,
  customRange,
  onPeriodChange,
  onCustomRangeChange,
  onRetry,
}: PortfolioChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const showCustom = period === 'CUSTOM';

  const curve = data?.curve ?? [];
  const pts = curve.map((p) => toNum(p.v));
  const dates = curve.map((p) => formatCurveDate(p.t));
  const { line, area, mn, mx } = buildSVGPath(pts);
  const startVal = pts[0] ?? 0;
  const currentVal = data?.totalValue ?? pts[pts.length - 1] ?? 0;

  const changeAmount = toNum(data?.change.amount);
  const changePct = toNum(data?.change.pct);
  const isPositive = changeAmount >= 0;

  const stats = data?.stats;
  const currency = data?.currency ?? 'USD';

  const yLabels = [
    fmtK(mx),
    fmtK(mn + (mx - mn) * 0.75),
    fmtK(mn + (mx - mn) * 0.5),
    fmtK(mn + (mx - mn) * 0.25),
  ];

  const handlePeriodClick = (p: PortfolioTimeframe) => {
    onPeriodChange(p);
    setHoverIndex(null);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || pts.length < 2) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const idx = Math.round(pct * (pts.length - 1));
    setHoverIndex(Math.max(0, Math.min(idx, pts.length - 1)));
  };

  const hoverData =
    hoverIndex !== null && pts.length > 0
      ? {
          value: pts[hoverIndex],
          date: dates[hoverIndex] ?? '',
          change: pts[hoverIndex] - startVal,
          changePct:
            startVal !== 0
              ? ((pts[hoverIndex] - startVal) / startVal) * 100
              : 0,
          x: pts.length > 1 ? (hoverIndex / (pts.length - 1)) * 100 : 0,
          y:
            PAD +
            (H - 2 * PAD) *
              (1 - (pts[hoverIndex] - mn) / (mx - mn || 1)),
        }
      : null;

  if (error && !data) {
    return (
      <div className="mb-5 rounded-[20px] border border-destructive/30 bg-destructive/10 py-16 text-center">
        <p className="mb-4 text-destructive">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative mb-5 overflow-hidden rounded-[20px] border border-[rgba(200,160,60,0.15)] bg-[#0c0c0c] opacity-0 shadow-[0_0_0_1px_rgba(200,160,60,0.05)_inset,0_24px_60px_rgba(0,0,0,0.5)] animate-[fadeUp_0.6s_ease_0.1s_both]">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,160,60,0.45)] to-transparent" />

      <div className="grid grid-cols-[1fr_auto] items-start gap-4 border-b border-[rgba(255,255,255,0.05)] p-6 pb-4 md:grid-cols-[1fr_auto] md:gap-8 md:p-8 md:pb-6">
        <div>
          <div className="mb-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-[#d4af37] opacity-85">
            Total portfolio value · {currency}
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-5">
            <div className="font-outfit text-[50px] font-bold leading-none tracking-[-0.035em] text-white md:text-[64px]">
              {loading && !data ? '…' : fmtUSD(currentVal)}
            </div>
            {data && (
              <div className="flex flex-wrap items-center gap-2 md:gap-2.5 md:pb-1.5">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-outfit text-[19px] font-semibold tracking-[-0.02em] md:px-3.5 md:text-[24px] ${
                    isPositive
                      ? 'border border-[rgba(232,200,74,0.2)] bg-[rgba(232,200,74,0.08)] text-[#e8c84a]'
                      : 'border border-[rgba(255,144,144,0.2)] bg-[rgba(255,144,144,0.08)] text-[#ff9090]'
                  }`}
                >
                  {isPositive ? '▲' : '▼'} {fmtSignedUSD(changeAmount)}
                </div>
                <div
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-[14px] font-medium tracking-[0.04em] md:px-3 md:text-[16px] ${
                    isPositive
                      ? 'border border-[rgba(232,200,74,0.15)] bg-[rgba(232,200,74,0.05)] text-[rgba(232,200,74,0.9)]'
                      : 'border border-[rgba(255,144,144,0.15)] bg-[rgba(255,144,144,0.05)] text-[rgba(255,144,144,0.9)]'
                  }`}
                >
                  {fmtPct(changePct)}
                </div>
                <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#c8c3bb] md:pb-1.5">
                  {PERIOD_LABEL[period]}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-3 md:w-auto md:items-end">
          <div className="flex w-full gap-0.5 overflow-x-auto rounded-[9px] border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] p-1 md:w-auto">
            {PORTFOLIO_TIMEFRAMES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriodClick(p)}
                disabled={loading}
                className={`whitespace-nowrap rounded-md px-2 py-1.5 font-mono text-[13px] tracking-[0.08em] transition-all md:px-3 md:text-[15px] ${
                  period === p
                    ? 'bg-[rgba(232,200,74,0.1)] text-[#e8c84a] shadow-[0_1px_4px_rgba(0,0,0,0.3)]'
                    : 'text-[#8a847c] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#d8d3ca]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div
            className={`flex w-full flex-col items-start gap-2 transition-all md:w-auto md:flex-row md:items-center ${
              showCustom
                ? 'max-h-24 opacity-100 md:max-h-11'
                : 'max-h-0 overflow-hidden opacity-0'
            }`}
          >
            <input
              type="date"
              value={customRange.from}
              max={customRange.to}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, from: e.target.value })
              }
              className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-[#d8d3ca] outline-none transition-colors focus:border-[rgba(200,160,60,0.4)] md:w-auto"
            />
            <span className="hidden font-mono text-[11px] text-[#8a847c] md:inline">
              →
            </span>
            <input
              type="date"
              value={customRange.to}
              min={customRange.from}
              onChange={(e) =>
                onCustomRangeChange({ ...customRange, to: e.target.value })
              }
              className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-[#d8d3ca] outline-none transition-colors focus:border-[rgba(200,160,60,0.4)] md:w-auto"
            />
          </div>
        </div>
      </div>

      <div className="relative cursor-crosshair select-none">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0c0c0c]/60">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {hoverData && (
          <>
            <div
              className="pointer-events-none absolute bottom-0 top-0 w-px bg-gradient-to-b from-[rgba(200,160,60,0.65)] to-[rgba(200,160,60,0.05)]"
              style={{ left: `${hoverData.x}%` }}
            />
            <div
              className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-[#e8c84a] shadow-[0_0_10px_rgba(232,200,74,0.9)]"
              style={{
                left: `${hoverData.x}%`,
                top: `${(hoverData.y / H) * 100}%`,
              }}
            />
            <div
              className="pointer-events-none absolute top-2.5 z-10 -translate-x-1/2 whitespace-nowrap rounded-[9px] border border-[rgba(200,160,60,0.3)] bg-[rgba(10,10,10,0.97)] px-4 py-2.5"
              style={{ left: `${hoverData.x}%` }}
            >
              <div className="font-outfit text-[19px] font-bold text-white">
                {fmtUSD(hoverData.value)}
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-[#e8c84a]">
                {hoverData.change >= 0 ? '+' : '−'}
                {fmtUSD(Math.abs(hoverData.change))} (
                {hoverData.change >= 0 ? '+' : ''}
                {hoverData.changePct.toFixed(2)}%)
              </div>
              <div className="mt-0.5 font-mono text-[10.5px] text-[#8a847c]">
                {hoverData.date}
              </div>
            </div>
          </>
        )}

        {pts.length === 0 && !loading ? (
          <div className="flex h-[240px] items-center justify-center font-outfit text-[#8a847c]">
            No chart data for this period
          </div>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="block w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="30%" stopColor="#d4a830" />
                <stop offset="58%" stopColor="#e8c84a" />
                <stop offset="80%" stopColor="#f0d868" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
              <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4a830" stopOpacity="0.20" />
                <stop offset="55%" stopColor="#d4af37" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className="y-grid">
              <line
                x1="0"
                y1="48"
                x2="1180"
                y2="48"
                stroke="rgba(255,255,255,0.035)"
              />
              <line
                x1="0"
                y1="96"
                x2="1180"
                y2="96"
                stroke="rgba(255,255,255,0.035)"
              />
              <line
                x1="0"
                y1="144"
                x2="1180"
                y2="144"
                stroke="rgba(255,255,255,0.035)"
              />
              <line
                x1="0"
                y1="192"
                x2="1180"
                y2="192"
                stroke="rgba(255,255,255,0.035)"
              />
              <text
                x="14"
                y="44"
                fill="rgba(138,132,124,0.4)"
                fontFamily="DM Mono, monospace"
                fontSize="12"
              >
                {yLabels[0]}
              </text>
              <text
                x="14"
                y="92"
                fill="rgba(138,132,124,0.4)"
                fontFamily="DM Mono, monospace"
                fontSize="12"
              >
                {yLabels[1]}
              </text>
              <text
                x="14"
                y="140"
                fill="rgba(138,132,124,0.4)"
                fontFamily="DM Mono, monospace"
                fontSize="12"
              >
                {yLabels[2]}
              </text>
              <text
                x="14"
                y="188"
                fill="rgba(138,132,124,0.4)"
                fontFamily="DM Mono, monospace"
                fontSize="12"
              >
                {yLabels[3]}
              </text>
            </g>
            <path d={area} fill="url(#goldFill)" />
            <path
              d={line}
              fill="none"
              stroke="url(#goldLine)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.05)] md:grid-cols-3 lg:grid-cols-5">
        <div className="bg-[#0c0c0c] p-4 px-5 transition-colors hover:bg-[#101010]">
          <div className="mb-1 font-mono text-[13px] uppercase tracking-[0.15em] text-[#c8c3bb]">
            Total invested
          </div>
          <div className="font-outfit text-[21px] font-bold tracking-[-0.02em] text-white">
            {loading && !stats ? '…' : fmtUSD(toNum(stats?.totalInvested))}
          </div>
          <div className="mt-0.5 font-mono text-[13px] tracking-[0.06em] text-[#c8c3bb]">
            Initial allocation
          </div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 transition-colors hover:bg-[#101010]">
          <div className="mb-1 font-mono text-[13px] uppercase tracking-[0.15em] text-[#c8c3bb]">
            Total PnL
          </div>
          <div
            className={`font-outfit text-[21px] font-bold tracking-[-0.02em] ${
              toNum(stats?.totalPnl.amount) >= 0
                ? 'text-[#e8c84a]'
                : 'text-[#ff9090]'
            }`}
          >
            {loading && !stats
              ? '…'
              : fmtSignedUSD(toNum(stats?.totalPnl.amount))}
          </div>
          <div className="mt-0.5 font-mono text-[13px] tracking-[0.06em] text-[#c8c3bb]">
            {loading && !stats
              ? '…'
              : `${fmtPct(toNum(stats?.totalPnl.pct))} all time`}
          </div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 transition-colors hover:bg-[#101010]">
          <div className="mb-1 font-mono text-[13px] uppercase tracking-[0.15em] text-[#c8c3bb]">
            YTD Return
          </div>
          <div className="font-outfit text-[21px] font-bold tracking-[-0.02em] text-[#e8c84a]">
            {loading && !stats
              ? '…'
              : fmtPct(toNum(stats?.ytdReturnPct))}
          </div>
          <div className="mt-0.5 font-mono text-[13px] tracking-[0.06em] text-[#c8c3bb]">
            {loading && !stats
              ? '…'
              : `vs. ${fmtPct(toNum(stats?.benchmarkPct))} benchmark`}
          </div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 transition-colors hover:bg-[#101010]">
          <div className="mb-1 font-mono text-[13px] uppercase tracking-[0.15em] text-[#c8c3bb]">
            Max Drawdown
          </div>
          <div className="font-outfit text-[21px] font-bold tracking-[-0.02em] text-[#ff9090]">
            {loading && !stats
              ? '…'
              : fmtPct(toNum(stats?.maxDrawdownPct), false)}
          </div>
          <div className="mt-0.5 font-mono text-[13px] tracking-[0.06em] text-[#c8c3bb]">
            Weighted portfolio
          </div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 transition-colors hover:bg-[#101010]">
          <div className="mb-1 font-mono text-[13px] uppercase tracking-[0.15em] text-[#c8c3bb]">
            Risk / Reward
          </div>
          <div className="font-outfit text-[21px] font-bold tracking-[-0.02em] text-[#9ec8ff]">
            {loading && !stats
              ? '…'
              : `1 : ${toNum(stats?.riskReward).toFixed(1)}`}
          </div>
          <div className="mt-0.5 font-mono text-[13px] tracking-[0.06em] text-[#c8c3bb]">
            Across strategies
          </div>
        </div>
      </div>
    </div>
  );
}
