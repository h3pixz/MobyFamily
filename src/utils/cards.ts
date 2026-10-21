function hash(value: string) {
  let result = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }

  return result >>> 0;
}

export function getFullCardNumber(cardNumberMask: string, seed: string) {
  const digits = cardNumberMask.replace(/\D/g, '');

  if (digits.length === 16) {
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  const parts = cardNumberMask.split(/\s+/).filter(Boolean);
  const first = (parts[0] ?? '').replace(/\D/g, '').padEnd(4, '0').slice(0, 4);
  const last = (parts[parts.length - 1] ?? '')
    .replace(/\D/g, '')
    .padStart(4, '0')
    .slice(-4);
  const middle = hash(`${seed}:${cardNumberMask}`).toString().padStart(10, '0').slice(-8);

  return `${first} ${middle.slice(0, 4)} ${middle.slice(4)} ${last}`;
}
