'use client';

import { memo, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Seeded pseudo-random for SSR/client consistency
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate realistic equity curve data based on strategy performance
const generateEquityData = (
  days: number,
  seed: number,
  ytdReturn: number,
  maxDD: number
) => {
  const rand = seededRandom(seed);
  const data = [];
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  let value = 10000; // Starting equity
  const targetValue = 10000 * (1 + ytdReturn / 100);
  const dailyReturn = Math.pow(targetValue / value, 1 / days) - 1;
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Add some volatility while trending toward target
    const volatility = (rand() - 0.5) * 0.02;
    value *= (1 + dailyReturn + volatility);
    
    // Ensure we don't exceed max drawdown
    const currentDD = ((value - 10000) / 10000) * 100;
    if (currentDD < maxDD) {
      value = 10000 * (1 + maxDD / 100);
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      equity: Math.round(value),
    });
  }
  
  return data;
};

const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const returnPct = ((value - 10000) / 10000) * 100;
    
    return (
      <div className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#0a0a0a] px-3 py-2 text-xs shadow-lg">
        <p className="mb-1 text-[#a39b93]">{label}</p>
        <p className="font-semibold text-[#e8e2da]">
          ${value.toLocaleString()}
        </p>
        <p className={`text-xs ${returnPct >= 0 ? 'text-[#e8c84a]' : 'text-[#ff7e7e]'}`}>
          {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

interface StrategyChartProps {
  strategyId: string;
  ytdReturn: number;
  maxDD: number;
  color: string;
  period: string;
}

export const StrategyChart = memo(function StrategyChart({
  strategyId,
  ytdReturn,
  maxDD,
  color,
  period,
}: StrategyChartProps) {
  const data = useMemo(() => {
    const periodMap: Record<string, number> = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      'YTD': 120,
      '1Y': 365,
      'ALL': 730,
    };
    
    const days = periodMap[period] || 120;
    const seed = strategyId.charCodeAt(0) * 100;
    
    return generateEquityData(days, seed, ytdReturn, maxDD);
  }, [strategyId, ytdReturn, maxDD, period]);

  const gradientId = `equityGradient-${strategyId}`;

  return (
    <div className="h-32 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.03)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fill: '#a3a3a3', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            hide
          />

          <YAxis
            tick={{ fill: '#a3a3a3', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            hide
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: `${color}40`, strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="equity"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{
              r: 3,
              fill: color,
              stroke: '#0a0a0a',
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
