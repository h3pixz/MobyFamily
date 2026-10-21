import type { ChildUserWithCardsDto } from '@/api/gen/models/ChildUserWithCardsDto';
import { childProfile as demoChildProfile } from '@/data/dashboard';
import type { ChildProfile, FamilyMember } from '@/types/dashboard';
import { getFirstName } from '@/utils/greeting';

export function getAge(birthDay: string) {
  const birth = new Date(birthDay);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function getGenitiveName(name: string) {
  if (name.endsWith('а')) {
    return `${name.slice(0, -1)}ы`;
  }
  if (name.endsWith('я')) {
    return `${name.slice(0, -1)}и`;
  }
  if (name.endsWith('й')) {
    return `${name.slice(0, -1)}я`;
  }

  return `${name}а`;
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? '';
  const second = parts[1]?.charAt(0) ?? '';

  return `${first}${second}`.toUpperCase();
}

export function toChildProfile(child: ChildUserWithCardsDto): ChildProfile {
  const card = child.cards[0];
  const age = getAge(child.birthDay);

  return {
    ...demoChildProfile,
    name: getFirstName(child.name),
    initials: getInitials(child.name),
    age,
    ageGroup: child.role === 'TEEN_14_17' ? '14–17 лет' : '7–13 лет (под присмотром)',
    cardLast4: card?.cardNumberMask.slice(-4) ?? demoChildProfile.cardLast4,
    purchaseBalance: card?.balance ?? 0,
    dailyLimit: card?.dailyLimit ?? demoChildProfile.dailyLimit,
    dailySpent: card?.spentToday ?? 0,
  };
}

export function toFamilyMember(child: ChildUserWithCardsDto): FamilyMember {
  const profile = toChildProfile(child);

  return {
    id: child.id,
    kind: 'child',
    name: profile.name,
    roleLabel: 'Карта ребёнка',
    emoji: '👦🏻',
    age: profile.age,
    balance: profile.purchaseBalance,
  };
}
