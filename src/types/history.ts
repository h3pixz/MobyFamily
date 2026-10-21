export interface TopUpEntry {
  id: string;
  amount: number;
  goalTitle: string;
  comment: string | null;
  createdAt: string;
  fromName: string;
  isChildSelf: boolean;
}

export interface TopUpDayGroup {
  key: string;
  label: string;
  entries: TopUpEntry[];
}
