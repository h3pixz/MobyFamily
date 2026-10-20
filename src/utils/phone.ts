const PHONE_LENGTH = 9;

export function phoneDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function formatPhone(value: string) {
  const digits = phoneDigits(value).slice(0, PHONE_LENGTH);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 5) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
}

export function isPhoneComplete(value: string) {
  return phoneDigits(value).length === PHONE_LENGTH;
}

export function toPhoneNumber(value: string) {
  return `+375${phoneDigits(value)}`;
}

export function formatStoredPhone(value: string) {
  return value.startsWith('+375') ? formatPhone(value.slice(4)) : value;
}
