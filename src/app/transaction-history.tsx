import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchFamily } from '@/api/family';
import type { DetailedTransactionDto } from '@/api/gen/models/DetailedTransactionDto';
import { fetchMyTransactions } from '@/api/payments';
import { FamilyHeader } from '@/components/family/family-header';
import { ChildHistorySummary } from '@/components/history/child-history-summary';
import { HistoryFilterChips } from '@/components/history/history-filter-chips';
import { TransactionHistory } from '@/components/history/transaction-history';
import { TransactionSummaryCard } from '@/components/history/transaction-summary-card';
import { Icon } from '@/components/ui/icon';
import type { ChildProfile } from '@/types/dashboard';
import type { HistoryFilter } from '@/types/history';
import { toChildProfile } from '@/utils/family';
import { getMonthLabelPrepositional, groupByDay } from '@/utils/history';
import { filterTransactions, getMonthlySpending } from '@/utils/transactions';

const EMPTY_STATES: Record<HistoryFilter, { title: string; subtitle: string }> = {
  all: {
    title: 'Операций пока нет',
    subtitle: 'Здесь появятся покупки, переводы и пополнения копилки.',
  },
  purchases: {
    title: 'Покупок пока нет',
    subtitle: 'Оплаты картой появятся здесь.',
  },
  requests: {
    title: 'Запросов пока нет',
    subtitle: 'Запросы на оплату сверх лимита появятся здесь.',
  },
  income: {
    title: 'Пополнений пока нет',
    subtitle: 'Переводы и награды за задания появятся здесь.',
  },
  savings: {
    title: 'Пополнений копилки пока нет',
    subtitle: 'Пополнения целей появятся здесь.',
  },
};

export default function TransactionHistoryScreen() {
  const insets = useSafeAreaInsets();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [transactions, setTransactions] = useState<DetailedTransactionDto[]>([]);
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([fetchFamily(), fetchMyTransactions(100)]).then(
      ([familyResult, transactionsResult]) => {
        if (cancelled) {
          return;
        }

        if (familyResult.status === 'fulfilled') {
          setChild(toChildProfile(familyResult.value.user));
        }

        if (transactionsResult.status === 'fulfilled') {
          setTransactions(
            [...transactionsResult.value.transactions].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            ),
          );
        } else {
          setError('Не удалось загрузить историю операций');
        }

        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const groups = groupByDay(filterTransactions(transactions, filter));
  const spending = getMonthlySpending(transactions);
  const monthLabel = getMonthLabelPrepositional(new Date());
  const emptyState = EMPTY_STATES[filter];

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/child');
  };

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <FamilyHeader
          title="История"
          onPressBack={goBack}
          onPressProfile={() => router.push('/profile')}
        />
      </View>

      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{
          gap: 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator size="small" color="#1D63ED" />
          </View>
        ) : error ? (
          <View className="items-center gap-2 py-16">
            <Icon name="error-outline" size={28} color="#BA1A1A" />
            <Text className="text-center text-body-md font-inter text-on-surface-variant">
              {error}
            </Text>
          </View>
        ) : (
          <>
            {child ? <ChildHistorySummary child={child} /> : null}

            <HistoryFilterChips value={filter} onChange={setFilter} />

            {spending.count > 0 ? (
              <TransactionSummaryCard monthLabel={monthLabel} spending={spending} />
            ) : null}

            <TransactionHistory
              groups={groups}
              emptyTitle={emptyState.title}
              emptySubtitle={emptyState.subtitle}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}
