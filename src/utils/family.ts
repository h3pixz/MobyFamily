import type { ChildUserWithCardsDto } from '@/api/gen/models/ChildUserWithCardsDto';
import type { FamilyMemberUserDto } from '@/api/gen/models/FamilyMemberUserDto';
import type { ParentSummaryDto } from '@/api/gen/models/ParentSummaryDto';
import type { PiggyBankResponseDto } from '@/api/gen/models/PiggyBankResponseDto';
import type { TaskResponseDto } from '@/api/gen/models/TaskResponseDto';
import type { TransferRequestListItemDto } from '@/api/gen/models/TransferRequestListItemDto';
import type {
  ChildProfile,
  DecisionRequest,
  FamilyMember,
  SavingsGoal,
  Task,
} from '@/types/dashboard';
import { asString } from '@/utils/dto';
import { getFirstName } from '@/utils/greeting';
import { getPocketMoneySchedule } from '@/utils/limits';

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

const GENITIVE_EXCEPTIONS: Record<string, string> = {
  Павел: 'Павла',
  Пётр: 'Петра',
  Лев: 'Льва',
};

export function getGenitiveName(name: string) {
  const exception = GENITIVE_EXCEPTIONS[name];
  if (exception) {
    return exception;
  }
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
    name: getFirstName(child.name),
    initials: getInitials(child.name),
    age,
    ageGroup: child.role === 'TEEN_14_17' ? '14–17 лет' : '7–13 лет (под присмотром)',
    cardLast4: card ? card.cardNumberMask.slice(-4) : '••••',
    purchaseBalance: card?.balance ?? 0,
    dailyLimit: card?.dailyLimit ?? 0,
    dailySpent: card?.spentToday ?? 0,
    pocketMoney: card?.pocketMoneyAmount ?? 0,
    pocketMoneySchedule: `по ${getPocketMoneySchedule(card?.pocketMoneyDay ?? 1)}`,
  };
}

export function toChildTasks(tasks: TaskResponseDto[]): Task[] {
  return tasks
    .filter(
      (task) =>
        task.status === 'OPEN' || task.status === 'IN_PROGRESS' || task.status === 'SUBMITTED',
    )
    .map((task): Task => {
      const parentName = getFirstName(task.creator?.name);

      return {
        id: task.id,
        title: task.title,
        subtitle: typeof task.description === 'string' ? task.description : '',
        from: parentName ? `Задание от ${getGenitiveName(parentName)}` : 'Задание от родителей',
        icon: 'assignment',
        reward: { kind: 'money', amount: task.rewardAmount },
        status:
          task.status === 'SUBMITTED'
            ? 'submitted'
            : task.status === 'IN_PROGRESS'
              ? 'in_progress'
              : 'pending',
      };
    });
}

export function toSavingsGoal(piggyBank: PiggyBankResponseDto): SavingsGoal {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyDelta = piggyBank.contributions
    .filter((contribution) => new Date(contribution.createdAt).getTime() >= weekAgo)
    .reduce((sum, contribution) => sum + contribution.amount, 0);

  return {
    id: piggyBank.id,
    title: piggyBank.title,
    subtitle: typeof piggyBank.description === 'string' ? piggyBank.description : 'Копилка мечты',
    icon: 'savings',
    deadline: '',
    saved: piggyBank.currentAmount,
    target: piggyBank.targetAmount,
    weeklyDelta,
    monthsLeft: 0,
  };
}

export function toTransferDecision(request: TransferRequestListItemDto): DecisionRequest {
  const childName = request.child ? getFirstName(request.child.name) : 'Ребёнок';
  const cardLast4 = request.card?.cardNumberMask.slice(-4);

  return {
    id: `transfer-${request.id}`,
    kind: 'purchase',
    source: 'transfer',
    rawId: request.id,
    childId: request.child?.id,
    title: `${childName} просит перевести деньги`,
    subtitle: request.comment,
    amount: request.amount,
    icon: 'swap-horiz',
    note: `Запрос от ${childName}`,
    noteDetail: cardLast4 ? `на карту •• ${cardLast4}` : undefined,
  };
}

export function toTaskDecision(task: TaskResponseDto): DecisionRequest {
  const child = task.completedBy ?? task.assignedChild;
  const childName = child ? getFirstName(child.name) : 'Ребёнок';

  return {
    id: `task-${task.id}`,
    kind: 'task',
    source: 'task',
    rawId: task.id,
    childId: child?.id,
    title: task.title,
    subtitle: `${childName} отметил выполнение`,
    amount: task.rewardAmount,
    icon: 'assignment',
    note: 'Ждёт подтверждения',
    noteDetail: asString(task.submissionComment) ?? undefined,
  };
}

export function toFamilyMember(child: ChildUserWithCardsDto): FamilyMember {
  const profile = toChildProfile(child);

  return {
    id: child.id,
    kind: 'child',
    name: profile.name,
    roleLabel: child.role === 'TEEN_14_17' ? 'Карта подростка' : 'Карта ребёнка',
    emoji: child.role === 'TEEN_14_17' ? '🧑🏻' : '👦🏻',
    age: profile.age,
    balance: profile.purchaseBalance,
    removable: true,
  };
}

export function toSelfParentMember(user: FamilyMemberUserDto): FamilyMember {
  return {
    id: user.id,
    kind: 'parent',
    name: user.name,
    roleLabel: 'Текущий родитель',
    emoji: '🧑🏻',
    removable: false,
  };
}

export function toLinkedParentMember(parent: ParentSummaryDto): FamilyMember {
  return {
    id: parent.id,
    kind: 'parent',
    name: parent.name,
    roleLabel: 'Родитель',
    emoji: '🧑🏻',
    removable: true,
  };
}
