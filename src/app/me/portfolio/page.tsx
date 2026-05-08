"use client";

import { useState, useEffect } from "react";
import { PortfolioChart } from "./PortfolioChart";

// Customer's strategies data
const myStrategies = [
  { id: 'I', name: 'Aurum Momentum', invested: 120000, current: 142480, pnl: 22480, pnlPct: 18.7 },
  { id: 'II', name: 'Argentum Scalper', invested: 75000, current: 88650, pnl: 13650, pnlPct: 18.2 },
  { id: 'III', name: 'EUR/USD Precision', invested: 85000, current: 97760, pnl: 12760, pnlPct: 15.0 },
  { id: 'IV', name: 'GBP/JPY Volatility', invested: 65000, current: 78650, pnl: 13650, pnlPct: 21.0 },
  { id: 'V', name: 'S&P 500 Trend', invested: 95000, current: 112600, pnl: 17600, pnlPct: 18.5 },
  { id: 'VI', name: 'NASDAQ Momentum', invested: 80000, current: 94400, pnl: 14400, pnlPct: 18.0 },
  { id: 'VII', name: 'Crude Oil Range', invested: 70000, current: 82600, pnl: 12600, pnlPct: 18.0 },
  { id: 'VIII', name: 'Natural Gas Breakout', invested: 55000, current: 67100, pnl: 12100, pnlPct: 22.0 },
  { id: 'IX', name: 'Palladium Swing', invested: 72000, current: 85680, pnl: 13680, pnlPct: 19.0 },
  { id: 'X', name: 'AUD/USD Carry', invested: 68000, current: 77520, pnl: 9520, pnlPct: 14.0 },
];

// Calculate totals
const totalInvested = myStrategies.reduce((sum, s) => sum + s.invested, 0);
const totalCurrent = myStrategies.reduce((sum, s) => sum + s.current, 0);
const totalPnl = totalCurrent - totalInvested;
const totalPnlPct = ((totalPnl / totalInvested) * 100).toFixed(1);

export default function PortfolioPage() {
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
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
          <div className="font-display text-[32px] md:text-[50px] font-light text-white tracking-[-0.01em]">
            Good morning, <em className="italic">Sarah.</em>
          </div>
          <div className="font-mono md:text-[14px] tracking-[0.14em] uppercase text-[#c8c3bb] mt-1">
            Your portfolio is performing well across all 10 strategies.
          </div>
        </div>
        <div className="font-mono text-[15px] tracking-[0.12em] uppercase text-[#c8c3bb]">
          {timestamp}
        </div>
      </div>

      <PortfolioChart 
        totalCurrent={totalCurrent}
        totalInvested={totalInvested}
        totalPnl={totalPnl}
        totalPnlPct={Number(totalPnlPct)}
      />
    </main>
  );
}
