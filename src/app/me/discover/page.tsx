'use client';

import { useState } from 'react';
import { strategies } from '@/app/strategies/strategiesData';

export default function DiscoverPage() {
  const [filter, setFilter] = useState('all');

  const availableStrategies = strategies.filter(s => !s.invested);
  
  const filteredStrategies = availableStrategies.filter((s) => {
    if (filter === 'all') return true;
    return s.cls === filter;
  });

  return (
    <main className="pt-[calc(68px+50px+44px)] pb-20 px-4 md:px-8 lg:px-24">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 md:mb-8 gap-4 opacity-0 animate-[fadeUp_0.55s_ease_0.05s_both]">
        <div>
          <div className="font-display text-[28px] md:text-[32px] font-light text-white tracking-[-0.01em]">
            Discover new <em className="italic">opportunities.</em>
          </div>
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#8a847c] mt-1">
            {filteredStrategies.length} verified strategies available for investment
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 mb-6 opacity-0 animate-[fadeUp_0.55s_ease_0.1s_both] overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 transition-all whitespace-nowrap ${
            filter === 'all'
              ? 'text-[#e8c84a] border-[rgba(232,200,74,0.4)] bg-[rgba(232,200,74,0.06)]'
              : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('metals')}
          className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 transition-all whitespace-nowrap ${
            filter === 'metals'
              ? 'text-[#c9a44a] border-[rgba(200,160,60,0.4)] bg-[rgba(200,160,60,0.06)]'
              : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
          }`}
        >
          Metals
        </button>
        <button
          onClick={() => setFilter('forex')}
          className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 transition-all whitespace-nowrap ${
            filter === 'forex'
              ? 'text-[#9ec8ff] border-[rgba(158,200,255,0.4)] bg-[rgba(158,200,255,0.06)]'
              : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
          }`}
        >
          Forex
        </button>
        <button
          onClick={() => setFilter('indices')}
          className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 transition-all whitespace-nowrap ${
            filter === 'indices'
              ? 'text-[#c8b4ff] border-[rgba(200,180,255,0.4)] bg-[rgba(200,180,255,0.06)]'
              : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
          }`}
        >
          Indices
        </button>
        <button
          onClick={() => setFilter('commodities')}
          className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 transition-all whitespace-nowrap ${
            filter === 'commodities'
              ? 'text-[#7effa8] border-[rgba(126,255,168,0.4)] bg-[rgba(126,255,168,0.06)]'
              : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
          }`}
        >
          Commodities
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 opacity-0 animate-[fadeUp_0.6s_ease_0.15s_both]">
        {filteredStrategies.map((strategy, idx) => (
          <div
            key={strategy.id}
            className="bg-[#0c0c0c] border border-[rgba(255,255,255,0.08)] rounded-[18px] p-6 transition-all hover:border-[rgba(200,160,60,0.18)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
            style={{ animation: `fadeUp 0.5s ease ${0.15 + idx * 0.05}s both` }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-mono text-[8.5px] tracking-[0.13em] uppercase px-2.5 py-1 rounded ${strategy.tagCls}`}>
                    {strategy.tagLabel}
                  </span>
                  <span className="font-display text-[15px] text-[#a39b93] tracking-[0.06em]">
                    {strategy.id}
                  </span>
                </div>
                <h3 className="font-display text-[24px] font-normal text-white leading-tight tracking-[-0.01em]">
                  {strategy.name}
                </h3>
                <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#a39b93] mt-1">
                  Since {strategy.since}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tracking-[0.12em] uppercase text-[#a39b93]">
                  Risk
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((pip) => (
                    <div
                      key={pip}
                      className={`w-1.5 h-1.5 rounded-full ${
                        pip <= strategy.risk
                          ? 'bg-[rgba(200,160,60,0.65)]'
                          : 'bg-[rgba(255,255,255,0.1)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[14px] text-[#a39b93] leading-relaxed mb-5 border-b border-[rgba(255,255,255,0.05)] pb-5">
              {strategy.desc}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
              <div>
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#8a847c] mb-1">
                  YTD Return
                </div>
                <div className="font-outfit text-base font-bold text-[#e8c84a] tracking-[-0.01em]">
                  {strategy.ytd}
                </div>
              </div>
              <div>
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#8a847c] mb-1">
                  Max DD
                </div>
                <div className="font-outfit text-base font-bold text-[#ff9090] tracking-[-0.01em]">
                  {strategy.maxDD}%
                </div>
              </div>
              <div>
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#8a847c] mb-1">
                  Sharpe
                </div>
                <div className="font-outfit text-base font-bold text-white tracking-[-0.01em]">
                  {strategy.sharpe}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button className="font-outfit text-[13px] font-semibold tracking-[0.02em] text-black bg-gradient-to-r from-[#c9a44a] via-[#e8c84a] to-[#f5e090] rounded-lg px-5 py-2.5 transition-all hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(200,160,60,0.35)] whitespace-nowrap">
                Invest
              </button>
              <button className="font-outfit text-[13px] font-medium tracking-[0.02em] text-[#a39b93] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 transition-all hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)] whitespace-nowrap">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
