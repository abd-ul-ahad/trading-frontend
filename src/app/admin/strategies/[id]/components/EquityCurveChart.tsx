'use client';

import { useTheme } from 'next-themes';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { EquityCurvePoint } from '@/lib/api/strategyApi';

interface EquityCurveChartProps {
  data: EquityCurvePoint[];
}

export default function EquityCurveChart({ data }: EquityCurveChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chartData = data.map((point) => ({
    timestamp: new Date(point.timestamp).toLocaleDateString(),
    equity: point.equity,
    totalPnL: point.totalPnL,
    drawdown: point.drawdown,
  }));

  const axisColor = isDark ? '#a39b93' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)';
  const axisLineColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)';

  return (
    <div className="p-6 rounded-[18px] bg-card border border-[rgba(200,160,60,0.28)] dark:border-[rgba(200,160,60,0.15)]">
      <h2 className="font-display text-[24px] font-light text-foreground mb-6">
        Equity curve{' '}
        <span className="text-muted-foreground font-mono text-[13px] tracking-[0.1em] uppercase">
          · 60 days
        </span>
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="timestamp"
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={{ stroke: axisLineColor }}
          />
          <YAxis
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={{ stroke: axisLineColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#121212' : '#ffffff',
              border: isDark
                ? '1px solid rgba(200,160,60,0.25)'
                : '1px solid rgba(200,160,60,0.35)',
              borderRadius: '12px',
              color: isDark ? '#fafafa' : '#0f172a',
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#d4af37' }}
            formatter={(value) => {
              if (value == null) return '-';
              if (typeof value === 'number') return value.toFixed(2);
              return String(value);
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '11px',
              color: axisColor,
              fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#d4af37"
            dot={false}
            strokeWidth={2}
            name="Equity"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="totalPnL"
            stroke="#d4af37"
            dot={false}
            strokeWidth={2}
            name="Total P&L"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="drawdown"
            stroke={isDark ? '#ff8a8a' : '#dc2626'}
            dot={false}
            strokeWidth={2}
            name="Drawdown %"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
