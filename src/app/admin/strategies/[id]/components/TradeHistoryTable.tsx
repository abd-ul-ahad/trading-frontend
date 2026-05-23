'use client';

import { Trade } from '@/lib/api/strategyApi';

interface TradeHistoryTableProps {
  trades: Trade[];
}

export default function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  if (trades.length === 0) {
    return (
      <div className="p-8 text-center font-mono text-[13px] tracking-[0.1em] uppercase text-muted-foreground">
        No trades available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted border-b border-border">
          <tr>
            {[
              'Symbol',
              'Direction',
              'Entry Price',
              'Exit Price',
              'Quantity',
              'P&L',
              'Entry Time',
              'Exit Time',
              'Status',
            ].map((col, i) => (
              <th
                key={col}
                className={`px-6 py-3 font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground ${
                  i >= 2 && i <= 5 ? 'text-right' : i === 8 ? 'text-center' : 'text-left'
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {trades.map((trade) => (
            <tr
              key={trade.trade_id}
              className="hover:bg-muted/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-medium text-foreground">{trade.symbol}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`font-mono text-[12px] tracking-[0.08em] uppercase font-medium ${
                    trade.direction === 'long'
                      ? 'text-primary'
                      : 'text-red-600 dark:text-[#ff8a8a]'
                  }`}
                >
                  {trade.direction}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-foreground font-mono text-sm">
                {trade.entry_price.toFixed(4)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-foreground font-mono text-sm">
                {trade.exit_price ? trade.exit_price.toFixed(4) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-foreground font-mono text-sm">
                {trade.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {trade.pnl !== null ? (
                  <span
                    className={`font-mono text-sm font-medium ${
                      trade.pnl > 0
                        ? 'text-primary'
                        : 'text-red-600 dark:text-[#ff8a8a]'
                    }`}
                  >
                    ${trade.pnl.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                {new Date(trade.entry_time).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                {trade.exit_time
                  ? new Date(trade.exit_time).toLocaleString()
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span
                  className={`inline-flex items-center font-mono text-[10px] tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full border ${
                    trade.status === 'closed'
                      ? 'text-primary border-primary/35 bg-primary/10'
                      : trade.status === 'open'
                        ? 'text-primary border-primary/40 bg-primary/15'
                        : 'text-muted-foreground border-border bg-muted'
                  }`}
                >
                  {trade.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
