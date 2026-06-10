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
import { PerformanceCurvePoint } from '@/lib/api/strategyApi';

interface EquityCurveChartProps {
  data: PerformanceCurvePoint[];
}

export default function EquityCurveChart({ data }: EquityCurveChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chartData = data.map((point) => ({
    timestamp: new Date(point.t).toLocaleDateString(),
    index: point.v,
  }));

  const axisColor = isDark ? '#a39b93' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)';
  const axisLineColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)';

  return (
    <div className="p-6 rounded-[18px] bg-card border border-[rgba(200,160,60,0.28)] dark:border-[rgba(200,160,60,0.15)]">
      <h2 className="font-display text-[24px] font-light text-foreground mb-6">
        Performance curve{' '}
        <span className="text-muted-foreground font-mono text-[13px] tracking-[0.1em] uppercase">
          · normalized index
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
              backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'}`,
              borderRadius: '8px',
              color: isDark ? '#e8e4df' : '#0f172a',
            }}
            formatter={(value) => {
              if (value == null) return '-';
              if (typeof value === 'number') return [value.toFixed(2), 'Index'];
              return [String(value), 'Index'];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="index"
            name="Normalized index"
            stroke="#d4af37"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
