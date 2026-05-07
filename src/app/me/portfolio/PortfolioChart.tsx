'use client';

import { useState, useRef, useEffect } from 'react';

type Period = '1D' | '1W' | '1M' | '1Q' | 'YTD' | '1Y' | 'Max' | 'Custom';

const periods = {
  '1D': {
    usd: '+$1,240', pct: '+0.35%', lbl: 'today', pos: true,
    pts: [344200,344800,344100,345200,344900,345800,345600,346200,345900,346600,346300,347100,346800,347500,347200,348100,347800,348600,348300,349000,348700,349400,349100,349800,349500,350200,349900,350600,350300,351000,350700,351400,351100,351800,351500,352200,351900,352840],
    dates: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30','00:00','00:30','01:00','01:30','02:00','02:30','03:00','Now'],
  },
  '1W': {
    usd: '+$8,200', pct: '+2.38%', lbl: 'this week', pos: true,
    pts: [344640,343800,345200,344100,346500,345400,347200,346300,348100,347200,349300,348000,350100,349200,351400,350100,352840],
    dates: ['Mon 9am','Mon 5pm','Tue 9am','Tue 5pm','Wed 9am','Wed 5pm','Thu 9am','Thu 5pm','Fri 9am','Fri 5pm','Sat','Sat','Sun','Sun','Mon','Mon','Now'],
  },
  '1M': {
    usd: '+$24,100', pct: '+7.34%', lbl: 'this month', pos: true,
    pts: [328740,330200,329100,332500,331000,334800,333200,337100,335600,339400,337800,341600,340000,343800,342200,345600,344100,347200,345900,349100,347800,350600,349300,352840],
    dates: ['1 Apr','2 Apr','3 Apr','4 Apr','5 Apr','7 Apr','8 Apr','9 Apr','10 Apr','11 Apr','12 Apr','13 Apr','14 Apr','15 Apr','16 Apr','17 Apr','18 Apr','19 Apr','20 Apr','21 Apr','22 Apr','23 Apr','Today','Now'],
  },
  '1Q': {
    usd: '+$42,300', pct: '+13.6%', lbl: 'this quarter', pos: true,
    pts: [310540,312000,311200,314800,313200,317400,315800,319600,318000,322000,320400,324200,322600,326800,325000,329200,327800,331600,330000,334200,332600,336400,335000,339200,337600,341400,340000,344200,342600,346400,345000,348800,347400,350600,349200,352840],
    dates: ['1 Jan','8 Jan','15 Jan','22 Jan','29 Jan','5 Feb','12 Feb','19 Feb','26 Feb','5 Mar','12 Mar','19 Mar','26 Mar','1 Apr','8 Apr','15 Apr','23 Apr'],
  },
  'YTD': {
    usd: '+$59,700', pct: '+20.3%', lbl: 'year to date', pos: true,
    pts: [293140,295000,297200,299800,302400,305200,303600,307800,306000,310400,308600,313000,311200,316000,314400,319200,317600,322400,320800,325800,324200,329200,327600,332800,331200,336200,334600,339600,337800,342800,341200,346000,344400,349200,347600,352840],
    dates: ['Jan','Jan','Jan','Jan','Feb','Feb','Feb','Feb','Mar','Mar','Mar','Mar','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Apr','Now'],
  },
  '1Y': {
    usd: '+$68,200', pct: '+24.0%', lbl: 'past year', pos: true,
    pts: [284640,286400,288600,291200,294000,292400,296600,294800,299200,297600,302200,300600,305400,303800,308600,307000,312000,310400,315400,313800,318800,317200,322400,320600,325800,324000,329400,327600,332800,331200,336400,334800,339800,338000,343400,341600,346000,344400,348800,347200,350800,349200,352840],
    dates: ['Apr 25','May 25','May 25','Jun 25','Jun 25','Jul 25','Jul 25','Aug 25','Aug 25','Sep 25','Sep 25','Oct 25','Oct 25','Nov 25','Nov 25','Dec 25','Dec 25','Jan 26','Jan 26','Feb 26','Feb 26','Mar 26','Mar 26','Apr 26','Now'],
  },
  'Max': {
    usd: '+$52,840', pct: '+17.6%', lbl: 'since start', pos: true,
    pts: [300000,301200,299800,303400,302000,305800,304200,308000,306600,310400,309000,313000,311400,315400,313800,318000,316400,320600,319000,323400,321800,326200,324600,329200,327600,332200,330600,335400,333800,338400,336800,341600,340000,345000,343400,348000,346600,350800,349200,352840],
    dates: ['Start','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','Now'],
  },
};

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

export function PortfolioChart() {
  const [period, setPeriod] = useState<Period>('1W');
  const [showCustom, setShowCustom] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const data = periods[period === 'Custom' ? '1W' : period];
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
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#d4af37] mb-2.5 opacity-85">
            Total portfolio value · USD
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-5">
            <div className="font-outfit text-[46px] md:text-[58px] font-bold text-white tracking-[-0.035em] leading-none">
              {fmtUSD(currentVal)}
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-2.5 md:pb-1.5">
              <div className={`inline-flex items-center gap-1.5 font-outfit text-[17px] md:text-[21px] font-semibold tracking-[-0.02em] px-3 md:px-3.5 py-1.5 rounded-lg ${data.pos ? 'text-[#e8c84a] bg-[rgba(232,200,74,0.08)] border border-[rgba(232,200,74,0.2)]' : 'text-[#ff9090] bg-[rgba(255,144,144,0.08)] border border-[rgba(255,144,144,0.2)]'}`}>
                {data.pos ? '▲' : '▼'} {data.usd}
              </div>
              <div className={`inline-flex items-center gap-1 font-mono text-[13px] md:text-[14px] font-medium tracking-[0.04em] px-2.5 md:px-3 py-1.5 rounded-lg ${data.pos ? 'text-[rgba(232,200,74,0.9)] bg-[rgba(232,200,74,0.05)] border border-[rgba(232,200,74,0.15)]' : 'text-[rgba(255,144,144,0.9)] bg-[rgba(255,144,144,0.05)] border border-[rgba(255,144,144,0.15)]'}`}>
                {data.pct}
              </div>
              <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#c8c3bb] md:pb-1.5">
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
                className={`font-mono text-[12px] md:text-[13px] tracking-[0.08em] px-2 md:px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
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
            <input type="date" className="w-full md:w-auto bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-[#d8d3ca] outline-none focus:border-[rgba(200,160,60,0.4)] transition-colors" defaultValue="2026-01-01" />
            <span className="font-mono text-[10px] text-[#8a847c] hidden md:inline">→</span>
            <input type="date" className="w-full md:w-auto bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-[#d8d3ca] outline-none focus:border-[rgba(200,160,60,0.4)] transition-colors" defaultValue="2026-04-23" />
          </div>
        </div>
      </div>

      <div className="relative cursor-crosshair select-none">
        {hoverData && (
          <>
            <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-[rgba(200,160,60,0.65)] to-[rgba(200,160,60,0.05)] pointer-events-none" style={{ left: `${hoverData.x}%` }} />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-[#e8c84a] border-2 border-black shadow-[0_0_10px_rgba(232,200,74,0.9)] pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{ left: `${hoverData.x}%`, top: `${(hoverData.y / H) * 100}%` }} />
            <div className="absolute top-2.5 bg-[rgba(10,10,10,0.97)] border border-[rgba(200,160,60,0.3)] rounded-[9px] px-4 py-2.5 pointer-events-none -translate-x-1/2 whitespace-nowrap z-10" style={{ left: `${hoverData.x}%` }}>
              <div className="font-outfit text-[15px] font-bold text-white">{fmtUSD(hoverData.value)}</div>
              <div className="font-mono text-[10px] text-[#e8c84a] mt-0.5">{hoverData.change >= 0 ? '+' : ''}{fmtUSD(hoverData.change)} ({hoverData.change >= 0 ? '+' : ''}{hoverData.changePct}%)</div>
              <div className="font-mono text-[9.5px] text-[#8a847c] mt-0.5">{hoverData.date}</div>
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
            <text x="14" y="44" fill="rgba(138,132,124,0.4)" fontFamily="DM Mono, monospace" fontSize="9">{yLabels[0]}</text>
            <text x="14" y="92" fill="rgba(138,132,124,0.4)" fontFamily="DM Mono, monospace" fontSize="9">{yLabels[1]}</text>
            <text x="14" y="140" fill="rgba(138,132,124,0.4)" fontFamily="DM Mono, monospace" fontSize="9">{yLabels[2]}</text>
            <text x="14" y="188" fill="rgba(138,132,124,0.4)" fontFamily="DM Mono, monospace" fontSize="9">{yLabels[3]}</text>
          </g>
          <path d={area} fill="url(#goldFill)"/>
          <path d={line} fill="none" stroke="url(#goldLine)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-[rgba(255,255,255,0.05)] border-t border-[rgba(255,255,255,0.05)]">
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">Total invested</div>
          <div className="font-outfit text-[19px] font-bold text-white tracking-[-0.02em]">$300,000</div>
          <div className="font-mono text-[12px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">Initial allocation</div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">Total PnL</div>
          <div className="font-outfit text-[19px] font-bold text-[#e8c84a] tracking-[-0.02em]">+$52,840</div>
          <div className="font-mono text-[12px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">+17.6% all time</div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">YTD Return</div>
          <div className="font-outfit text-[19px] font-bold text-[#e8c84a] tracking-[-0.02em]">+20.3%</div>
          <div className="font-mono text-[12px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">vs. 9.2% benchmark</div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">Max Drawdown</div>
          <div className="font-outfit text-[19px] font-bold text-[#ff9090] tracking-[-0.02em]">−7.1%</div>
          <div className="font-mono text-[12px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">Weighted portfolio</div>
        </div>
        <div className="bg-[#0c0c0c] p-4 px-5 hover:bg-[#101010] transition-colors">
          <div className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#c8c3bb] mb-1">Risk / Reward</div>
          <div className="font-outfit text-[19px] font-bold text-[#9ec8ff] tracking-[-0.02em]">1 : 2.4</div>
          <div className="font-mono text-[12px] text-[#c8c3bb] mt-0.5 tracking-[0.06em]">Across strategies</div>
        </div>
      </div>
    </div>
  );
}
