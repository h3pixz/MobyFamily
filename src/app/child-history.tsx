import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchFamily } from '@/api/family';
import type { DetailedTransactionDto } from '@/api/gen/models/DetailedTransactionDto';
import { fetchMemberTransactions } from '@/api/payments';
import { fetchPiggyBanks } from '@/api/piggy-banks';
import { FamilyHeader } from '@/components/family/family-header';
import { ChildHistorySummary } from '@/components/history/child-history-summary';
import { TopUpHistory } from '@/components/history/top-up-history';
import { TopUpsSummary } from '@/components/history/top-ups-summary';
import { TransactionHistory } from '@/components/history/transaction-history';
import { TransactionSummaryCard } from '@/components/history/transaction-summary-card';
import { Icon } from '@/components/ui/icon';
import type { ChildProfile } from '@/types/dashboard';
import type { TopUpEntry } from '@/types/history';
import { toChildProfile } from '@/utils/family';
import {
  getCurrentMonthTopUps,
  getMonthLabelPrepositional,
  groupByDay,
  toTopUpEntries,
} from '@/utils/history';
import { filterTransactions, getMonthlySpending } from '@/utils/transactions';

export default function ChildHistoryScreen() {
  const { childId } = useLocalSearchParams<{ childId?: string }>();
  const insets = useSafeAreaInsets();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [transactions, setTransactions] = useState<DetailedTransactionDto[]>([]);
  const [entries, setEntries] = useState<TopUpEntry[]>([]);
  const [loading, setLoading] = useState(Boolean(childId));
  const [error, setError] = useState<string | null>(childId ? null : 'Ребёнок не найден');

  useEffect(() => {
    if (!childId) {
      return;
    }

    let cancelled = false;

    Promise.allSettled([fetchFamily(), fetchPiggyBanks(), fetchMemberTransactions(childId)]).then(
      ([familyResult, piggyBanksResult, transactionsResult]) => {
        if (cancelled) {
          return;
        }

        if (familyResult.status === 'fulfilled') {
          const foundChild = familyResult.value.children.find((item) => item.id === childId);

          if (foundChild) {
            setChild(toChildProfile(foundChild));
          }
        }

        if (piggyBanksResult.status === 'fulfilled') {
          setEntries(toTopUpEntries(piggyBanksResult.value, childId));
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
  }, [childId]);

  const purchases = groupByDay(filterTransactions(transactions, 'purchases'));
  const topUpGroups = groupByDay(entries);
  const spending = getMonthlySpending(transactions);
  const monthTopUps = getCurrentMonthTopUps(entries);
  const monthLabel = getMonthLabelPrepositional(new Date());

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
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

            {spending.count > 0 ? (
              <TransactionSummaryCard monthLabel={monthLabel} spending={spending} />
            ) : null}

            <TransactionHistory
              groups={purchases}
              emptyTitle="Покупок пока нет"
              emptySubtitle="Оплаты картой ребёнка появятся здесь."
            />

            {monthTopUps.count > 0 ? (
              <TopUpsSummary
                monthLabel={monthLabel}
                total={monthTopUps.total}
                count={monthTopUps.count}
              />
            ) : null}

            <TopUpHistory groups={topUpGroups} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
