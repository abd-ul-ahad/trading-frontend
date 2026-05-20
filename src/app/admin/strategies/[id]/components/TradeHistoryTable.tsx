'use client';

import { Trade } from '@/lib/api/strategyApi';

interface TradeHistoryTableProps {
  trades: Trade[];
}

export default function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  if (trades.length === 0) {
    return (
      <div className="p-6 text-center text-slate-600 dark:text-slate-400">
        No trades available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Direction
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Entry Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Exit Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              P&L
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Entry Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Exit Time
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {trades.map((trade) => (
            <tr
              key={trade.trade_id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {trade.symbol}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`font-semibold ${
                    trade.direction === 'long'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {trade.direction.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-slate-900 dark:text-white">
                {trade.entry_price.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-slate-900 dark:text-white">
                {trade.exit_price ? trade.exit_price.toFixed(4) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-slate-900 dark:text-white">
                {trade.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {trade.pnl !== null ? (
                  <span
                    className={`font-semibold ${
                      trade.pnl > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    ${trade.pnl.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-slate-600 dark:text-slate-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                {new Date(trade.entry_time).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                {trade.exit_time
                  ? new Date(trade.exit_time).toLocaleString()
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    trade.status === 'closed'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : trade.status === 'open'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
