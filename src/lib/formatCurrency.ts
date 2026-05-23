/** Format a dollar amount with exactly 2 decimal places. */
export function formatCurrency(value: number | string): string {
  const num = Number(value);
  if (Number.isNaN(num)) return '$0.00';
  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
