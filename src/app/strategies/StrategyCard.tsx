'use client';

import { useState } from 'react';
import { Strategy } from './strategiesData';
import { StrategyChart } from './StrategyChart';

interface StrategyCardProps {
  strategy: Strategy;
  index: number;
}

export default function StrategyCard({ strategy, index }: StrategyCardProps) {
  const [activePeriod, setActivePeriod] = useState('YTD');

  const isPositive = strategy.ytdN > 0;

  return (
    <div
      className={`bg-[#0c0c0c] rounded-[18px] border border-[rgba(255,255,255,0.08)] overflow-hidden flex flex-col relative transition-all duration-250 hover:border-[rgba(255,255,255,0.13)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)] ${
        strategy.cls
      } ${strategy.invested ? 'is-invested' : ''}`}
      style={{
        animation: `cardIn 0.5s ease-out ${index * 0.05}s both`
      }}
    >
      {/* Top bar gradient */}
      <div className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none z-[1]" />

      {/* Card Header */}
      <div className="p-6 pb-4 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-medium tracking-[0.14em] uppercase px-2.5 py-1 rounded ${strategy.tagCls}`}>
              {strategy.tagLabel}
            </span>
            <span className="font-display text-[15px] text-[#a39b93] tracking-[0.06em]">
              {strategy.id}
            </span>
          </div>
          <h3 className="font-display text-[32px] md:text-[36px] font-normal text-white leading-[1.1] tracking-[-0.01em] max-md:text-[26px]">
            {strategy.name}
          </h3>
          <div className="font-mono text-[13px] tracking-[0.12em] uppercase text-[#a39b93]">
            Since {strategy.since}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 flex-shrink-0 pt-0.5">
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

          {strategy.invested && (
            <div className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] uppercase text-[#d4d5e0] bg-[rgba(168,169,200,0.07)] border border-[rgba(168,169,200,0.22)] rounded-md px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4d5e0] shadow-[0_0_7px_rgba(212,213,224,0.7)] animate-pulse" />
              Invested
              <span className="text-[rgba(212,213,224,0.6)] pl-1 border-l border-[rgba(168,169,200,0.2)] ml-0.5">
                {strategy.investedAmount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="px-7 pb-5 text-[16px] text-[#a39b93] leading-[1.8] border-b border-[rgba(255,255,255,0.05)]">
        {strategy.desc}
      </div>

      {/* Chart Area */}
      <div className="p-5 px-7 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between mb-3.5 max-md:flex-col max-md:items-start max-md:gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs tracking-[0.14em] uppercase text-[#a39b93]">
              Equity Curve
            </span>
            <div
              className={`inline-flex items-center gap-1 font-mono text-[13px] px-2 py-0.5 rounded ${
                isPositive
                  ? 'text-[#e8c84a] bg-[rgba(232,200,74,0.07)] border border-[rgba(232,200,74,0.2)]'
                  : 'text-[#ff7e7e] bg-[rgba(255,126,126,0.07)] border border-[rgba(255,126,126,0.2)]'
              }`}
            >
              {strategy.ytd}
            </div>
          </div>

          <div className="flex gap-0.5">
            {['1M', '3M', '6M', 'YTD', '1Y', 'ALL'].map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`font-mono text-[13px] border border-transparent rounded px-2.5 py-1 cursor-pointer transition-all ${
                  activePeriod === period
                    ? `text-[${strategy.color}] border-[rgba(232,200,74,0.3)] bg-[rgba(232,200,74,0.06)]`
                    : 'text-[#a39b93] hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.08)]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Equity curve chart */}
        <StrategyChart
          strategyId={strategy.id}
          ytdReturn={strategy.ytdN}
          maxDD={strategy.maxDD}
          color={strategy.color}
          period={activePeriod}
        />
      </div>

      {/* Metrics */}
      <div className="p-5 px-7 grid grid-cols-3 gap-0 border-b border-[rgba(255,255,255,0.05)] max-md:grid-cols-1 max-md:gap-4">
        <div className="pr-5 border-r border-[rgba(255,255,255,0.05)] max-md:border-r-0 max-md:pr-0">
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-[rgba(163,155,147,0.7)] mb-3 pb-2 border-b border-[rgba(255,255,255,0.05)]">
            Performance
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-[#a39b93] whitespace-nowrap">
                YTD
              </span>
              <span className="font-outfit text-[18px] font-bold text-[#e8c84a] tracking-[-0.01em] whitespace-nowrap">
                {strategy.ytd}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-[#a39b93] whitespace-nowrap">
                All-Time
              </span>
              <span className="font-outfit text-[18px] font-bold text-white tracking-[-0.01em] whitespace-nowrap">
                {strategy.allTime}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-[#a39b93] whitespace-nowrap">
                Avg/Month
              </span>
              <span className="font-outfit text-[18px] font-bold text-white tracking-[-0.01em] whitespace-nowrap">
                {strategy.monthAvg}
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 border-r border-[rgba(255,255,255,0.05)] max-md:border-r-0 max-md:px-0 max-md:border-t max-md:border-[rgba(255,255,255,0.05)] max-md:pt-4">
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-[rgba(163,155,147,0.7)] mb-3 pb-2 border-b border-[rgba(255,255,255,0.05)]">
            Risk
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-[#a39b93] whitespace-nowrap">
                Max DD
              </span>
              <span className="font-outfit text-[18px] font-bold text-[#ff9090] tracking-[-0.01em] whitespace-nowrap">
                {strategy.maxDD}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-[#a39b93] whitespace-nowrap">
                Sharpe
              </span>
              <span className="font-outfit text-[18px] font-bold text-white tracking-[-0.01em] whitespace-nowrap">
                {strategy.sharpe}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-[#a39b93] whitespace-nowrap">
                Win Rate
              </span>
              <span className="font-outfit text-[18px] font-bold text-white tracking-[-0.01em] whitespace-nowrap">
                {strategy.winRate}%
              </span>
            </div>
          </div>
        </div>

        <div className="pl-5 max-md:pl-0 max-md:border-t max-md:border-[rgba(255,255,255,0.05)] max-md:pt-4">
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-[rgba(163,155,147,0.7)] mb-3 pb-2 border-b border-[rgba(255,255,255,0.05)]">
            Trading
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-[#a39b93] whitespace-nowrap">
                Avg Win
              </span>
              <span className="font-outfit text-[18px] font-bold text-[#e8c84a] tracking-[-0.01em] whitespace-nowrap">
                {strategy.avgWin}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-[#a39b93] whitespace-nowrap">
                Avg Loss
              </span>
              <span className="font-outfit text-[18px] font-bold text-[#ff9090] tracking-[-0.01em] whitespace-nowrap">
                {strategy.avgLoss}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs tracking-[0.08em] uppercase text-[#a39b93] whitespace-nowrap">
                Trades
              </span>
              <span className="font-outfit text-[18px] font-bold text-white tracking-[-0.01em] whitespace-nowrap">
                {strategy.totalTrades}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 px-7 flex items-center justify-end gap-3">
        {strategy.invested ? (
          <button className="font-outfit text-[13px] font-semibold tracking-[0.02em] text-[#d4d5e0] bg-[rgba(168,169,200,0.07)] border border-[rgba(168,169,200,0.25)] rounded-lg px-5 py-2.5 cursor-pointer transition-all hover:bg-[rgba(168,169,200,0.12)] hover:border-[rgba(168,169,200,0.42)] hover:-translate-y-px whitespace-nowrap">
            Manage
          </button>
        ) : (
          <button className="font-outfit text-[13px] font-semibold tracking-[0.02em] text-black bg-gradient-to-r from-[#d4af37] via-[#e8c84a] to-[#f5e090] bg-[length:200%_auto] rounded-lg px-5 py-2.5 cursor-pointer transition-all hover:bg-right hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(212,175,55,0.35)] whitespace-nowrap">
            Invest
          </button>
        )}
        <button className="font-outfit text-[13px] font-medium tracking-[0.02em] text-[#a39b93] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 cursor-pointer transition-all hover:text-[#e8e2da] hover:border-[rgba(255,255,255,0.18)] whitespace-nowrap">
          View Details
        </button>
      </div>
    </div>
  );
}
