'use client';

import { useState, useEffect } from 'react';
import { PortfolioChart } from './PortfolioChart';

export default function PortfolioPage() {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setTimestamp(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="pt-[calc(68px+50px+44px)] pb-20 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both]">
        <div>
          <div className="font-display text-[32px] md:text-[36px] font-light text-white tracking-[-0.01em]">
            Good morning, <em className="italic">Sarah.</em>
          </div>
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#c8c3bb] mt-1">
            Your portfolio is performing well across all 3 strategies.
          </div>
        </div>
        <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#c8c3bb]">
          {timestamp}
        </div>
      </div>

      <PortfolioChart />

      <div className="font-mono text-[12px] tracking-[0.18em] uppercase text-[#c8c3bb] mb-3 opacity-0 animate-[fadeUp_0.55s_ease_0.25s_both]">
        Allocation breakdown
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 opacity-0 animate-[fadeUp_0.6s_ease_0.3s_both]">
        <div className="bg-[#0c0c0c] border border-[rgba(255,255,255,0.08)] rounded-[14px] p-5 grid grid-cols-[1fr_auto] gap-3 items-start transition-all hover:border-[rgba(200,160,60,0.18)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,160,60,0.5)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="font-mono text-[9px] tracking-[0.13em] uppercase px-2 py-0.5 rounded bg-[rgba(200,160,60,0.1)] text-[#d4af37] border border-[rgba(200,160,60,0.2)]">
                Metals
              </span>
            </div>
            <div className="font-display text-[21px] font-normal text-white leading-none mb-1">
              Strategy I
            </div>
            <div className="font-mono text-[11px] tracking-[0.1em] text-[#c8c3bb] uppercase">
              $120,000 · 40% of portfolio
            </div>
          </div>
          <div className="text-right">
            <div className="font-outfit text-[19px] font-bold text-white tracking-[-0.02em] leading-none mb-1">
              $142,480
            </div>
            <div className="font-ui text-[14px] font-semibold text-[#e8c84a]">
              +$22,480
            </div>
            <div className="font-mono text-[11px] text-[rgba(232,200,74,0.85)] mt-0.5">
              +18.7% total
            </div>
          </div>
          <div className="col-span-2 mt-3">
            <svg viewBox="0 0 340 44" fill="none" className="w-full">
              <defs>
                <linearGradient id="sp1f" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a44a" stopOpacity=".18"/>
                  <stop offset="100%" stopColor="#c9a44a" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,36 L28,30 L57,32 L85,20 L113,14 L142,18 L170,10 L198,8 L227,12 L255,6 L283,4 L311,2 L340,1 L340,44 L0,44 Z" fill="url(#sp1f)"/>
              <polyline points="0,36 28,30 57,32 85,20 113,14 142,18 170,10 198,8 227,12 255,6 283,4 311,2 340,1" stroke="#c9a44a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="bg-[#0c0c0c] border border-[rgba(255,255,255,0.08)] rounded-[14px] p-5 grid grid-cols-[1fr_auto] gap-3 items-start transition-all hover:border-[rgba(200,160,60,0.18)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,180,255,0.5)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="font-mono text-[9px] tracking-[0.13em] uppercase px-2 py-0.5 rounded bg-[rgba(200,180,255,0.08)] text-[#d4c4ff] border border-[rgba(200,180,255,0.18)]">
                Indices
              </span>
            </div>
            <div className="font-display text-[21px] font-normal text-white leading-none mb-1">
              Strategy III
            </div>
            <div className="font-mono text-[11px] tracking-[0.1em] text-[#c8c3bb] uppercase">
              $85,000 · 28% of portfolio
            </div>
          </div>
          <div className="text-right">
            <div className="font-outfit text-[19px] font-bold text-white tracking-[-0.02em] leading-none mb-1">
              $97,760
            </div>
            <div className="font-ui text-[14px] font-semibold text-[#e8c84a]">
              +$12,760
            </div>
            <div className="font-mono text-[11px] text-[rgba(232,200,74,0.85)] mt-0.5">
              +15.0% total
            </div>
          </div>
          <div className="col-span-2 mt-3">
            <svg viewBox="0 0 340 44" fill="none" className="w-full">
              <defs>
                <linearGradient id="sp3f" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8b4ff" stopOpacity=".15"/>
                  <stop offset="100%" stopColor="#c8b4ff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,30 L28,32 L57,28 L85,26 L113,27 L142,22 L170,24 L198,18 L227,20 L255,16 L283,14 L311,12 L340,10 L340,44 L0,44 Z" fill="url(#sp3f)"/>
              <polyline points="0,30 28,32 57,28 85,26 113,27 142,22 170,24 198,18 227,20 255,16 283,14 311,12 340,10" stroke="#c8b4ff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="bg-[#0c0c0c] border border-[rgba(255,255,255,0.08)] rounded-[14px] p-5 grid grid-cols-[1fr_auto] gap-3 items-start transition-all hover:border-[rgba(200,160,60,0.18)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(158,200,255,0.5)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="font-mono text-[9px] tracking-[0.13em] uppercase px-2 py-0.5 rounded bg-[rgba(158,200,255,0.08)] text-[#aed8ff] border border-[rgba(158,200,255,0.18)]">
                Forex
              </span>
            </div>
            <div className="font-display text-[21px] font-normal text-white leading-none mb-1">
              Strategy V
            </div>
            <div className="font-mono text-[11px] tracking-[0.1em] text-[#c8c3bb] uppercase">
              $95,000 · 32% of portfolio
            </div>
          </div>
          <div className="text-right">
            <div className="font-outfit text-[19px] font-bold text-white tracking-[-0.02em] leading-none mb-1">
              $112,600
            </div>
            <div className="font-ui text-[14px] font-semibold text-[#e8c84a]">
              +$17,600
            </div>
            <div className="font-mono text-[11px] text-[rgba(232,200,74,0.85)] mt-0.5">
              +18.5% total
            </div>
          </div>
          <div className="col-span-2 mt-3">
            <svg viewBox="0 0 340 44" fill="none" className="w-full">
              <defs>
                <linearGradient id="sp5f" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ec8ff" stopOpacity=".13"/>
                  <stop offset="100%" stopColor="#9ec8ff" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,32 L28,26 L57,30 L85,22 L113,16 L142,20 L170,12 L198,10 L227,14 L255,8 L283,6 L311,4 L340,2 L340,44 L0,44 Z" fill="url(#sp5f)"/>
              <polyline points="0,32 28,26 57,30 85,22 113,16 142,20 170,12 198,10 227,14 255,8 283,6 311,4 340,2" stroke="#9ec8ff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}
