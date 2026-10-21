export type HistoryFilter = 'all' | 'purchases' | 'requests' | 'income' | 'savings';

export interface DayGroup<T> {
  key: string;
  label: string;
  entries: T[];
}

export interface TopUpEntry {
  id: string;
  amount: number;
  goalTitle: string;
  comment: string | null;
  createdAt: string;
  fromName: string;
  isChildSelf: boolean;
}

export type TopUpDayGroup = DayGroup<TopUpEntry>;
