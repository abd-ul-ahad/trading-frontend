'use client';

import { useState, useRef } from 'react';

// Customer's strategies data
const myStrategies = [
  { id: 'I', name: 'Aurum Momentum', type: 'Metals', invested: 120000, current: 142480, pnl: 22480, pnlPct: 18.7, allocation: 40 },
  { id: 'II', name: 'Argentum Scalper', type: 'Metals', invested: 75000, current: 88650, pnl: 13650, pnlPct: 18.2, allocation: 25 },
  { id: 'III', name: 'EUR/USD Precision', type: 'Forex', invested: 85000, current: 97760, pnl: 12760, pnlPct: 15.0, allocation: 28 },
  { id: 'IV', name: 'GBP/JPY Volatility', type: 'Forex', invested: 65000, current: 78650, pnl: 13650, pnlPct: 21.0, allocation: 22 },
  { id: 'V', name: 'S&P 500 Trend', type: 'Indices', invested: 95000, current: 112600, pnl: 17600, pnlPct: 18.5, allocation: 32 },
  { id: 'VI', name: 'NASDAQ Momentum', type: 'Indices', invested: 80000, current: 94400, pnl: 14400, pnlPct: 18.0, allocation: 27 },
  { id: 'VII', name: 'Crude Oil Range', type: 'Commodities', invested: 70000, current: 82600, pnl: 12600, pnlPct: 18.0, allocation: 23 },
  { id: 'VIII', name: 'Natural Gas Breakout', type: 'Commodities', invested: 55000, current: 67100, pnl: 12100, pnlPct: 22.0, allocation: 18 },
  { id: 'IX', name: 'Palladium Swing', type: 'Metals', invested: 72000, current: 85680, pnl: 13680, pnlPct: 19.0, allocation: 24 },
  { id: 'X', name: 'AUD/USD Carry', type: 'Forex', invested: 68000, current: 77520, pnl: 9520, pnlPct: 14.0, allocation: 23 },
];

const totalInvested = myStrategies.reduce((sum, s) => sum + s.invested, 0);
const totalCurrent = myStrategies.reduce((sum, s) => sum + s.current, 0);
const totalPnl = totalCurrent - totalInvested;

// Generate curve data
function generateCurve(seed: number, points: number, startValue: number, endValue: number) {
  const data = [];
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const value = startValue + (endValue - startValue) * progress + Math.sin(i * seed) * (endValue * 0.02);
    data.push(value);
  }
  return data;
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 280, H = 80, PAD = 5;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = PAD + (H - 2 * PAD) * (1 - (v - min) / range);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  
  const pathLine = `M${points}`;
  const pathArea = `M${points} L${W},${H} L0,${H} Z`;
  
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.01} />
        </linearGradient>
      </defs>
      <path d={pathArea} fill={`url(#grad-${color})`} />
      <path d={pathLine} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

export default function MyStrategiesPage() {
  return (
    <main className="pt-[calc(68px+50px+44px)] pb-20 px-4 md:px-8 lg:px-24">
      {/* Header */}
      <div className="mb-6 md:mb-8 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both]">
        <div className="font-display text-[32px] md:text-[50px] font-light text-white tracking-[-0.01em]">
          Your active <em className="italic">strategies.</em>
        </div>
        <div className="font-mono md:text-[14px] tracking-[0.14em] uppercase text-[#c8c3bb] mt-1">
          Currently invested in 10 strategies with total allocation of ${totalInvested.toLocaleString()}
        </div>
      </div>

      {/* Portfolio Summary Chart - Same design as Portfolio page */}
      <div className="bg-[#0c0c0c] border border-[rgba(200,160,60,0.15)] rounded-[20px] p-6 md:p-8 mb-8 opacity-0 animate-[fadeUp_0.6s_ease_0.1s_both]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#d4af37] mb-2">
              Total strategies value · USD
            </div>
            <div className="font-outfit text-[42px] md:text-[56px] font-bold text-white tracking-[-0.035em] leading-none">
              ${totalCurrent.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="font-outfit text-[19px] font-semibold text-[#e8c84a]">
                +${totalPnl.toLocaleString()}
              </div>
              <div className="font-mono text-[14px] text-[#c8c3bb]">
                +{((totalPnl / totalInvested) * 100).toFixed(1)}% total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategies List */}
      <div className="space-y-5 opacity-0 animate-[fadeUp_0.6s_ease_0.15s_both]">
        {myStrategies.map((strategy, idx) => {
          const returnData = generateCurve(0.3 + idx * 0.1, 40, strategy.invested, strategy.current);
          const equityData = generateCurve(0.5 + idx * 0.15, 40, strategy.invested * 0.95, strategy.current * 1.02);
          
          return (
            <div
              key={strategy.id}
              className="bg-[#0c0c0c] border border-[rgba(255,255,255,0.08)] rounded-[18px] p-6 transition-all hover:border-[rgba(200,160,60,0.18)]"
            >
              {/* Strategy Header */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display text-[15px] text-[#c8c3bb]">
                    Strategy {strategy.id}
                  </span>
                </div>
                <h3 className="font-display text-[28px] font-normal text-white leading-tight tracking-[-0.01em] mb-3">
                  {strategy.name}
                </h3>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                      Current Value
                    </div>
                    <div className="font-outfit text-[21px] font-bold text-white">
                      ${strategy.current.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                      Total PnL
                    </div>
                    <div className="font-outfit text-[21px] font-bold text-[#e8c84a]">
                      +${strategy.pnl.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                      Return
                    </div>
                    <div className="font-outfit text-[21px] font-bold text-[#e8c84a]">
                      +{strategy.pnlPct}%
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-1">
                      Allocation
                    </div>
                    <div className="font-outfit text-[21px] font-bold text-white">
                      {strategy.allocation}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[rgba(255,255,255,0.05)] pt-4">
                {/* Left: Return Chart */}
                <div>
                  <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-2">
                    Return Performance
                  </div>
                  <div className="h-20 bg-[rgba(255,255,255,0.02)] rounded-lg p-2">
                    <MiniChart data={returnData} color="#d4af37" />
                  </div>
                  <div className="font-mono text-[10px] text-[#8a847c] mt-1">
                    Investment performance of fixed sum
                  </div>
                </div>

                {/* Right: Equity Chart */}
                <div>
                  <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#c8c3bb] mb-2">
                    Equity Curve
                  </div>
                  <div className="h-20 bg-[rgba(255,255,255,0.02)] rounded-lg p-2">
                    <MiniChart data={equityData} color="#60a5fa" />
                  </div>
                  <div className="font-mono text-[10px] text-[#8a847c] mt-1">
                    Cash flows in/out of brokerage account
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button className="font-outfit text-[13px] font-semibold text-[#d4d5e0] bg-[rgba(168,169,200,0.07)] border border-[rgba(168,169,200,0.25)] rounded-lg px-5 py-2.5 transition-all hover:bg-[rgba(168,169,200,0.12)]">
                  Manage Position
                </button>
                <button className="font-outfit text-[13px] font-medium text-[#c8c3bb] border border-[rgba(255,255,255,0.08)] rounded-lg px-5 py-2.5 transition-all hover:text-[#e8e2da]">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
