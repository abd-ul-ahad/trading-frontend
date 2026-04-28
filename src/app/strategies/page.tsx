'use client';

import { useState } from 'react';
import StrategyCard from './StrategyCard';
import { strategies, Strategy } from './strategiesData';

export default function StrategiesPage() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ytd');

  const filteredStrategies = strategies.filter((s: Strategy) => {
    if (filter === 'all') return true;
    if (filter === 'invested') return s.invested;
    return s.cls === filter;
  });

  const sortedStrategies = [...filteredStrategies].sort((a, b) => {
    if (sortBy === 'ytd') return b.ytdN - a.ytdN;
    if (sortBy === 'maxdd') return a.maxDD - b.maxDD;
    if (sortBy === 'sharpe') return b.sharpe - a.sharpe;
    return 0;
  });

  return (
    <div className="min-h-screen bg-black text-[#e8e2da]">      
      <div className="pt-[110px] px-16 max-w-[1360px] mx-auto flex items-end justify-between gap-10 max-lg:px-8 max-md:flex-col max-md:items-start max-md:gap-7">
        <div>
          <div className="font-mono text-[13px] tracking-[0.22em] uppercase text-[#c9a44a] mb-3.5 opacity-90">
            Available strategies
          </div>
          <h1 className="font-display text-[52px] font-light text-white leading-[1.05] tracking-[-0.015em] max-lg:text-[42px] max-md:text-[34px]">
            Browse & invest in<br/><em className="italic text-[#f2efe9]">verified performance.</em>
          </h1>
          <p className="text-[15px] text-[#a39b93] leading-[1.75] max-w-[460px] mt-3.5">
            Every strategy below is sourced live from a verified MT5 account. Performance data is real, unfiltered, and updated continuously.
          </p>
        </div>
        <div className="flex gap-9 flex-shrink-0 pb-1 max-md:flex-row max-md:gap-7">
          <div className="text-right max-md:text-left">
            <div className="font-outfit text-[30px] font-bold tracking-[-0.03em] leading-none gold-text max-lg:text-2xl">
              {strategies.length}
            </div>
            <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#a39b93] mt-1.5">
              Active strategies
            </div>
          </div>
          <div className="text-right max-md:text-left">
            <div className="font-outfit text-[30px] font-bold tracking-[-0.03em] leading-none silver-text max-lg:text-2xl">
              +21.4%
            </div>
            <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#a39b93] mt-1.5">
              Platform avg YTD
            </div>
          </div>
          <div className="text-right max-md:text-left">
            <div className="font-outfit text-[30px] font-bold tracking-[-0.03em] leading-none gold-text max-lg:text-2xl">
              3
            </div>
            <div className="font-mono text-xs tracking-[0.14em] uppercase text-[#a39b93] mt-1.5">
              In your portfolio
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 px-16 max-w-[1360px] mx-auto flex items-center justify-between gap-5 max-lg:px-8 max-md:px-5">
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 cursor-pointer transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'text-[#e8c84a] border-[rgba(232,200,74,0.4)] bg-[rgba(232,200,74,0.06)]'
                : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('metals')}
            className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 cursor-pointer transition-all whitespace-nowrap ${
              filter === 'metals'
                ? 'text-[#c9a44a] border-[rgba(200,160,60,0.4)] bg-[rgba(200,160,60,0.06)]'
                : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
            }`}
          >
            Metals
          </button>
          <button
            onClick={() => setFilter('forex')}
            className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 cursor-pointer transition-all whitespace-nowrap ${
              filter === 'forex'
                ? 'text-[#9ec8ff] border-[rgba(158,200,255,0.4)] bg-[rgba(158,200,255,0.06)]'
                : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
            }`}
          >
            Forex
          </button>
          <button
            onClick={() => setFilter('indices')}
            className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 cursor-pointer transition-all whitespace-nowrap ${
              filter === 'indices'
                ? 'text-[#c8b4ff] border-[rgba(200,180,255,0.4)] bg-[rgba(200,180,255,0.06)]'
                : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
            }`}
          >
            Indices
          </button>
          <button
            onClick={() => setFilter('commodities')}
            className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 cursor-pointer transition-all whitespace-nowrap ${
              filter === 'commodities'
                ? 'text-[#7effa8] border-[rgba(126,255,168,0.4)] bg-[rgba(126,255,168,0.06)]'
                : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
            }`}
          >
            Commodities
          </button>
          <button
            onClick={() => setFilter('invested')}
            className={`font-mono text-[13px] tracking-[0.12em] uppercase border rounded-full px-4 py-1.5 cursor-pointer transition-all whitespace-nowrap ${
              filter === 'invested'
                ? 'text-[#d4d5e0] border-[rgba(168,169,200,0.5)] bg-[rgba(168,169,200,0.06)]'
                : 'text-[#a39b93] border-[rgba(255,255,255,0.08)] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)]'
            }`}
          >
            Invested
          </button>
        </div>
        <div className="flex items-center gap-3.5 flex-shrink-0">
          <span className="font-mono text-xs tracking-[0.14em] uppercase text-[#a39b93]">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="font-mono text-[13px] tracking-[0.08em] text-[#e8e2da] bg-[#0c0c0c] border border-[rgba(255,255,255,0.08)] rounded-lg px-3.5 py-1.5 cursor-pointer outline-none focus:border-[rgba(200,160,60,0.4)]"
          >
            <option value="ytd">YTD Return ↓</option>
            <option value="maxdd">Max Drawdown ↑</option>
            <option value="sharpe">Sharpe Ratio ↓</option>
            <option value="since">Inception Date</option>
          </select>
          <span className="font-mono text-xs tracking-[0.12em] text-[#a39b93]">
            <strong className="text-[#e8e2da] font-medium">{sortedStrategies.length}</strong> strategies
          </span>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto mt-7 px-16 pb-24 grid grid-cols-2 gap-5 max-lg:px-8 max-md:grid-cols-1 max-md:px-5 max-md:pb-16">
        {sortedStrategies.map((strategy, idx) => (
          <StrategyCard key={strategy.id} strategy={strategy} index={idx} />
        ))}
      </div>
    </div>
  );
}
