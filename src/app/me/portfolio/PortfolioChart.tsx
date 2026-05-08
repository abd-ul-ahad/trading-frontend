'use client';

import { useState, useRef, useEffect } from 'react';

type Period = '1D' | '1W' | '1M' | '1Q' | 'YTD' | '1Y' | 'Max' | 'Custom';

interface PortfolioChartProps {
  totalCurrent: number;
  totalInvested: number;
  totalPnl: number;
  totalPnlPct: number;
}

const W = 1180, H = 240, PAD = 20;

function buildSVGPath(pts: number[]) {
  const n = pts.length;
  const mn = Math.min(...pts), mx = Math.max(...pts);
  const rng = mx - mn || 1;
  const yOf = (v: number) => PAD + (H - 2 * PAD) * (1 - (v - mn) / rng);
  const xOf = (i: number) => (i / (n - 1)) * W;
  let line = 'M', area = 'M';
  pts.forEach((v, i) => {
    const x = xOf(i).toFixed(2);
    const y = yOf(v).toFixed(2);
    line += (i ? 'L' : '') + x + ',' + y + ' ';
    area += (i ? 'L' : '') + x + ',' + y + ' ';
  });
  area += `L${W},${H} L0,${H} Z`;
  return { line, area, mn, mx, rng };
}

function fmtUSD(v: number) {
  return '$' + Math.round(v).toLocaleString();
}

function fmtK(v: number) {
  if (v >= 1000000) return '$' + (v / 1000000).toFixed(2) + 'M';
  if (v >= 1000) return '$' + (v / 1000).toFixed(0) + 'k';
  return '$' + v;
}

export function PortfolioChart({ totalCurrent, totalInvested, totalPnl, totalPnlPct }: PortfolioChartProps) {
  const [period, setPeriod] = useState<Period>('1W');
  const [showCustom, setShowCustom] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate chart data based on totalCurrent
  const generatePeriodData = (periodKey: Period) => {
    const baseValue = totalInvested;
    const currentValue = totalCurrent;
    
    const periods: Record<Period, any> = {
      '1D': {
        usd: `+$${((currentValue - baseValue) * 0.02).toFixed(0)}`,
        pct: '+0.35%',
        lbl: 'today',
        pos: true,
        pts: Array.from({ length: 38 }, (_, i) => baseValue + ((currentValue - baseValue) * (i / 37)) + (Math.sin(i) * 2000)),
        dates: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30','00:00','00:30','01:00','01:30','02:00','02:30','03:00','Now'],
      },
      '1W': {
        usd: `+$${((currentValue - baseValue) * 0.15).toFixed(0)}`,
        pct: '+2.38%',
        lbl: 'this week',
        pos: true,
        pts: Array.from({ length: 17 }, (_, i) => baseValue + ((currentValue - baseValue) * (i / 16)) + (Math.sin(i * 0.5) * 3000)),
        dates: ['Mon 9am','Mon 5pm','Tue 9am','Tue 5pm','Wed 9am','Wed 5pm','Thu 9am','Thu 5pm','Fri 9am','Fri 5pm','Sat','Sat','Sun','Sun','Mon','Mon','Now'],
      },
      '1M': {
        usd: `+$${((currentValue - baseValue) * 0.45).toFixed(0)}`,
        pct: '+7.34%',
        lbl: 'this month',
        pos: true,
        pts: Array.from({ length: 24 }, (_, i) => baseValue + ((currentValue - baseValue) * (i / 23)) + (Math.sin(i * 0.3) * 4000)),
        dates: ['1 Apr','2 Apr','3 Apr','4 Apr','5 Apr','7 Apr','8 Apr','9 Apr','10 Apr','11 Apr','12 Apr','13 Apr','14 Apr','15 Apr','16 Apr','17 Apr','18 Apr','19 Apr','20 Apr','21 Apr','22 Apr','23 Apr','Today','Now'],
      },
      '1Q': {
        usd: `+$${((currentValue - baseValue) * 0.8).toFixed(0)}`,
        pct: '+13.6%',
        lbl: 'this quarter',
        pos: true,
        pts: Array.from({ length: 36 }, (_, i) => baseValue + ((currentValue - baseValue) * (i / 35)) + (Math.sin(i * 0.2) * 5000)),
        dates: ['1 Jan','8 Jan','15 Jan','22 Jan','29 Jan','5 Feb','12 Feb','19 Feb','26 Feb','5 Mar','12 Mar','19 Mar','26 Mar','1 Apr','8 Apr','15 Apr','23 Apr'],
      },
      'YTD': {
        usd: `+$${(totalPnl * 0.9).toFixed(0)}`,
        pct: `+${(totalPnlPct * 0.9).toFixed(1)}%`,
        lbl: 'year to date',
        pos: true,
        pts: Array.from({ length: 36 }, (_, i) => baseValue + ((currentValue - baseValue) * 0.9 * (i / 35)) + (Math.sin(i * 0.15) * 6000)),
        dates: ['Jan','Jan','Jan','Jan','Feb','Feb','Feb','Feb','Mar','Mar','Mar','Mar','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Now'],
      },
      '1Y': {
        usd: `+$${(totalPnl * 0.95).toFixed(0)}`,
        pct: `+${(totalPnlPct * 0.95).toFixed(1)}%`,
        lbl: 'past year',
        pos: true,
        pts: Array.from({ length: 43 }, (_, i) => baseValue + ((currentValue - baseValue) * 0.95 * (i / 42)) + (Math.sin(i * 0.1) * 7000)),
        dates: ['Apr 25','May 25','May 25','Jun 25','Jun 25','Jul 25','Jul 25','Aug 25','Aug 25','Sep 25','Sep 25','Oct 25','Oct 25','Nov 25','Nov 25','Dec 25','Dec 25','Jan 26','Jan 26','Feb 26','Feb 26','Mar 26','Mar 26','Apr 26','Now'],
      },
      'Max': {
        usd: `+$${totalPnl.toFixed(0)}`,
        pct: `+${totalPnlPct.toFixed(1)}%`,
        lbl: 'since start',
        pos: true,
        pts: Array.from({ length: 40 }, (_, i) => baseValue + ((currentValue - baseValue) * (i / 39)) + (Math.sin(i * 0.12) * 8000)),
        dates: ['Start','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','Now'],
      },
      'Custom': {
        usd: `+$${((currentValue - baseValue) * 0.15).toFixed(0)}`,
        pct: '+2.38%',
        lbl: 'custom range',
        pos: true,
        pts: Array.from({ length: 17 }, (_, i) => baseValue + ((currentValue - baseValue) * (i / 16)) + (Math.sin(i * 0.5) * 3000)),
        dates: ['Start','','','','','','','','','','','','','','','','Now'],
      },
    };
    
    return periods[periodKey];
  };

  const data = generatePeriodData(period);
  const { line, area, mn, mx } = buildSVGPath(data.pts);
  const startVal = data.pts[0];
  const currentVal = data.pts[data.pts.length - 1];

  const yLabels = [
    fmtK(mx),
    fmtK(mn + (mx - mn) * 0.75),
    fmtK(mn + (mx - mn) * 0.5),
    fmtK(mn + (mx - mn) * 0.25),
  ];

  const handlePeriodClick = (p: Period) => {
    setPeriod(p);
    setShowCustom(p === 'Custom');
    setHoverIndex(null);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const idx = Math.round(pct * (data.pts.length - 1));
    setHoverIndex(Math.max(0, Math.min(idx, data.pts.length - 1)));
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoverData = hoverIndex !== null ? {
    value: data.pts[hoverIndex],
    date: data.dates[hoverIndex],
    change: data.pts[hoverIndex] - startVal,
    changePct: ((data.pts[hoverIndex] - startVal) / startVal * 100).toFixed(2),
    x: (hoverIndex / (data.pts.length - 1)) * 100,
    y: PAD + (H - 2 * PAD) * (1 - (data.pts[hoverIndex] - mn) / (mx - mn || 1)),
  } : null;

  return (
    <div className="bg-[#0c0c0c] border border-[rgba(200,160,60,0.15)] rounded-[20px] overflow-hidden relative mb-5 opacity-0 animate-[fadeUp_0.6s_ease_0.1s_both] shadow-[0_0_0_1px_rgba(200,160,60,0.05)_inset,0_24px_60px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,160,60,0.45)] to-transparent pointer-events-none" />

      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto] items-start gap-4 md:gap-8 p-6 md:p-8 pb-4 md:pb-6 border-b border-[rgba(255,255,255,0.05)]">
        <div>
          <div className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#d4af37] mb-2.5 opacity-85">
            Total portfolio value · USD
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-5">
            <div className="font-outfit text-[50px] md:text-[64px] font-bold text-white tracking-[-0.035em] leading-none">
              {fmtUSD(currentVal)}
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-2.5 md:pb-1.5">
              <div className={`inline-flex items-center gap-1.5 font-outfit text-[19px] md:text-[24px] font-semibold tracking-[-0.02em] px-3 md:px-3.5 py-1.5 rounded-lg ${data.pos ? 'text-[#e8c84a] bg-[rgba(232,200,74,0.08)] border border-[rgba(232,200,74,0.2)]' : 'text-[#ff9090] bg-[rgba(255,144,144,0.08)] border border-[rgba(255,144,144,0.2)]'}`}>
                {data.pos ? '▲' : '▼'} {data.usd}
              </div>
              <div className={`inline-flex items-center gap-1 font-mono text-[14px] md:text-[16px] font-medium tracking-[0.04em] px-2.5 md:px-3 py-1.5 rounded-lg ${data.pos ? 'text-[rgba(232,200,74,0.9)] bg-[rgba(232,200,74,0.05)] border border-[rgba(232,200,74,0.15)]' : 'text-[rgba(255,144,144,0.9)] bg-[rgba(255,144,144,0.05)] border border-[rgba(255,144,144,0.15)]'}`}>
                {data.pct}
              </div>
              <div className="font-mono text-[12px] tracking-[0.14em] uppercase text-[#c8c3bb] md:pb-1.5">
                {data.lbl}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
          <div className="flex gap-0.5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[9px] p-1 overflow-x-auto w-full md:w-auto">
            {(['1D', '1W', '1M', '1Q', 'YTD', '1Y', 'Max', 'Custom'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodClick(p)}
                className={`font-mono text-[13px] md:text-[15px] tracking-[0.08em] px-2 md:px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  period === p
                    ? 'text-[#e8c84a] bg-[rgba(232,200,74,0.1)] shadow-[0_1px_4px_rgba(0,0,0,0.3)]'
                    : 'text-[#8a847c] hover:text-[#d8d3ca] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className={`flex flex-col md:flex-row items-start md:items-center gap-2 transition-all w-full md:w-auto ${showCustom ? 'opacity-100 max-h-24 md:max-h-11' : 'opacity-0 max-h-0 overflow-hidden'}`}>
            <input type="date" className="w-full md:w-auto bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-[#d8d3ca] outline-none focus:border-[rgba(200,160,60,0.4)] transition-colors" defaultValue="2026-01-01" />
            <span className="font-mono text-[11px] text-[#8a847c] hidden md:inline">→</span>
            <input type="date" className="w-full md:w-auto bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-[#d8d3ca] outline-none focus:border-[rgba(200,160,60,0.4)] transition-colors" defaultValue="2026-04-23" />
          </div>
        </div>
      </div>

      <div className="relative cursor-crosshair select-none">
        {hoverData && (
          <>
            <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-[rgba(200,160,60,0.65)] to-[rgba(200,160,60,0.05)] pointer-events-none" style={{ left: `${hoverData.x}%` }} />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-[#e8c84a] border-2 border-black shadow-[0_0_10px_rgba(232,200,74,0.9)] pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{ left: `${hoverData.x}%`, top: `${(hoverData.y / H) * 100}%` }} />
            <div className="absolute top-2.5 bg-[rgba(10,10,10,0.97)] border border-[rgba(200,160,60,0.3)] rounded-[9px] px-4 py-2.5 pointer-events-none -translate-x-1/2 whitespace-nowrap z-10" style={{ left: `${hoverData.x}%` }}>
              <div className="font-outfit text-[19px] font-bold text-white">{fmtUSD(hoverData.value)}</div>
              <div className="font-mono text-[11px] text-[#e8c84a] mt-0.5">{hoverData.change >= 0 ? '+' : ''}{fmtUSD(hoverData.change)} ({hoverData.change >= 0 ? '+' : ''}{hoverData.changePct}%)</div>
              <div className="font-mono text-[10.5px] text-[#8a847c] mt-0.5">{hoverData.date}</div>
            </div>
          </>
        )}
        <svg
          ref={svgRef}
          viewBox="0 0 1180 240"
          preserveAspectRatio="none"
          className="block w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9a7b1a"/>
              <stop offset="30%" stopColor="#d4a830"/>
              <stop offset="58%" stopColor="#e8c84a"/>
              <stop offset="80%" stopColor="#f0d868"/>
              <stop offset="100%" stopColor="#c9a44a"/>
            </linearGradient>
            <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4a830" stopOpacity="0.20"/>
              <stop offset="55%" stopColor="#c9a44a" stopOpacity="0.05"/>
              <stop offset="100%" stopColor="#c9a44a" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <g className="y-grid">
            <line x1="0" y1="48" x2="1180" y2="48" stroke="rgba(255,255,255,0.035)"/>
            <line x1="0" y1="96" x2="1180" y2="96" stroke="rgba(255,255,255,0.035)"/>
            <line x1="0" y1="144" x2="1180" y2="144" stroke="rgba(255,255,255,0.035)"/>
            <line x1="0" y1="192" x2="1180" y2="192" stroke="rgba(255,255,255,0.035)"/>
            <text x="14" y="44" fill="rgba(138,132,124,0.4)" fontFamily="DM Mono, monospace" fontSize="12">{yLabels[0]}</text>
            <text x="14" y="92" fill="rgba(138,132,124,0.4)" fontFamily="DM Mono, monospace" fontSize="12">{yLabels[1]}</text>
            <text x="14" y="140" fill="rgba(138,132,124,0.4)" fontFamily="DM Mono, monospace" fontSize="12">{yLabels[2]}</text>
            <text x="14" y="188" fill="rgba(138,132,124,0.4)" fontFamily="DM Mono, monospace" fontSize="12">{yLabels[3]}</text>
          </g>
          <path d={area} fill="url(#goldFill)"/>
          <path d={line} fill="none" stroke="url(#goldLine)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[rgba(255,255,255,0.05)] border-t border-[rgba(255,255,255,0.05)]">
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[13px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">Total invested</div>
          <div className="font-outfit text-[21px] font-bold text-white tracking-[-0.02em]">{fmtUSD(totalInvested)}</div>
          <div className="font-mono text-[13px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">Initial allocation</div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[13px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">Total PnL</div>
          <div className="font-outfit text-[21px] font-bold text-[#e8c84a] tracking-[-0.02em]">+{fmtUSD(totalPnl)}</div>
          <div className="font-mono text-[13px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">+{totalPnlPct.toFixed(1)}% all time</div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[13px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">YTD Return</div>
          <div className="font-outfit text-[21px] font-bold text-[#e8c84a] tracking-[-0.02em]">+20.3%</div>
          <div className="font-mono text-[13px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">vs. 9.2% benchmark</div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[13px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">Max Drawdown</div>
          <div className="font-outfit text-[21px] font-bold text-[#ff9090] tracking-[-0.02em]">−7.1%</div>
          <div className="font-mono text-[13px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">Weighted portfolio</div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[13px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">Risk / Reward</div>
          <div className="font-outfit text-[21px] font-bold text-[#9ec8ff] tracking-[-0.02em]">1 : 2.4</div>
          <div className="font-mono text-[13px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">Across strategies</div>
        </div>
      </div>
    </div>
  );
}
