export function sanitizeAmountInput(value: string) {
  const normalized = value.replace(/[^0-9.,]/g, '').replace(/\./g, ',');
  const [integer = '', ...fractionParts] = normalized.split(',');

  if (fractionParts.length === 0) {
    return integer;
  }

  return `${integer},${fractionParts.join('').slice(0, 2)}`;
}

export function parseAmountInput(value: string) {
  const parsed = Number.parseFloat(value.replace(',', '.'));

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.round(parsed * 100) / 100;
}

export function formatAmountInput(value: number) {
  return value.toFixed(2).replace('.', ',');
}

export function getGoalEmoji(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes('ноутбук') || normalized.includes('компьютер')) {
    return '💻';
  }
  if (normalized.includes('телефон')) {
    return '📱';
  }
  if (normalized.includes('наушник')) {
    return '🎧';
  }
  if (normalized.includes('велосипед')) {
    return '🚲';
  }
  if (normalized.includes('игр') || normalized.includes('пристав')) {
    return '🎮';
  }

  return '🎯';
}

export function getWeeklyContributions(contributions: { amount: number; createdAt: string }[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return contributions
    .filter((contribution) => new Date(contribution.createdAt).getTime() >= weekAgo)
    .reduce((sum, contribution) => sum + contribution.amount, 0);
}
