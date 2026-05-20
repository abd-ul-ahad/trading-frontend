'use client';

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
  const chartData = data.map((point) => ({
    timestamp: new Date(point.timestamp).toLocaleDateString(),
    equity: point.equity,
    totalPnL: point.totalPnL,
    drawdown: point.drawdown,
  }));

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
        Equity Curve (60 days)
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="timestamp"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            labelStyle={{ color: '#f1f5f9' }}
            formatter={(value: any) => {
              if (typeof value === 'number') {
                return value.toFixed(2);
              }
              return value;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
            name="Equity"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="totalPnL"
            stroke="#10b981"
            dot={false}
            strokeWidth={2}
            name="Total P&L"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="drawdown"
            stroke="#ef4444"
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
