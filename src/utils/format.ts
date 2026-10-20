export function formatBYN(value: number): string {
  const formatted = Math.abs(value).toFixed(2).replace('.', ',');
  const sign = value < 0 ? '-' : '';
  return `${sign}${formatted}`;
}

export function formatSignedBYN(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatBYN(value)}`;
}

export function formatPercent(value: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.round((value / total) * 100);
}
