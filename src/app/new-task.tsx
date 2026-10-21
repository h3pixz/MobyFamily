import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { isChildRole } from '@/api/auth';
import { getApiErrorMessage } from '@/api/error';
import { fetchFamily } from '@/api/family';
import type { CardDto } from '@/api/gen/models/CardDto';
import type { ChildUserWithCardsDto } from '@/api/gen/models/ChildUserWithCardsDto';
import { createTask } from '@/api/tasks';
import { useAuth } from '@/auth/auth-context';
import { AmountField } from '@/components/money/amount-field';
import { CardPicker } from '@/components/money/card-picker';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { ModalSheet } from '@/components/ui/modal-sheet';
import { formatDateInput, toIsoDate } from '@/utils/date-input';
import { getFirstName } from '@/utils/greeting';
import { parseAmountInput } from '@/utils/piggy-bank';

function toDeadline(value: string) {
  const iso = toIsoDate(value);

  return iso ? new Date(`${iso}T18:00:00`).toISOString() : null;
}

export default function NewTaskScreen() {
  const params = useLocalSearchParams<{ childId?: string }>();
  const { profile } = useAuth();
  const isParent = !isChildRole(profile?.role ?? '');

  const [cards, setCards] = useState<CardDto[]>([]);
  const [children, setChildren] = useState<ChildUserWithCardsDto[]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [assignedChildId, setAssignedChildId] = useState<string | null>(
    params.childId ?? null,
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('10,00');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(isParent);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isParent) {
      return;
    }

    let cancelled = false;

    fetchFamily()
      .then((family) => {
        if (cancelled) {
          return;
        }

        setCards(family.user.cards);
        setChildren(family.children);
        setCardId(family.user.cards[0]?.id ?? null);
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isParent]);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const parsedAmount = parseAmountInput(amount);
  const deadlineIso = deadline ? toDeadline(deadline) : null;
  const titleError = title.trim().length === 0 ? 'Укажите название задания' : null;
  const amountError = parsedAmount < 0.1 ? 'Вознаграждение — от 0,10 BYN' : null;
  const deadlineError =
    deadline.length > 0 && !deadlineIso ? 'Укажите дату в формате ДД.ММ.ГГГГ' : null;
  const canSubmit =
    isParent &&
    Boolean(cardId) &&
    !titleError &&
    !amountError &&
    !deadlineError &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !cardId) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        rewardAmount: parsedAmount,
        deadline: deadlineIso ?? undefined,
        assignedChildId: assignedChildId ?? undefined,
        creatorCardId: cardId,
      });

      Alert.alert('Задание создано', response.message, [{ text: 'ОК', onPress: close }]);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  if (!isParent) {
    return (
      <ModalSheet title="Новое задание" onClose={close}>
        <View className="items-center gap-2 rounded-xl bg-surface-low px-4 py-6">
          <Icon name="info-outline" size={26} color="#1D63ED" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            Создавать задания могут только родители.
          </Text>
        </View>
      </ModalSheet>
    );
  }

  return (
    <ModalSheet
      title="Новое задание"
      subtitle="Вознаграждение сразу резервируется на вашей карте"
      onClose={close}>
      {loading ? (
        <View className="items-center py-10">
          <ActivityIndicator size="small" color="#1D63ED" />
        </View>
      ) : loadError ? (
        <View className="items-center gap-2 py-10">
          <Icon name="error-outline" size={28} color="#BA1A1A" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            {loadError}
          </Text>
        </View>
      ) : (
        <View className="gap-3.5">
          <Field
            label="Название"
            placeholder="Убрать в комнате"
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              setSubmitError(null);
            }}
            error={titleError ?? undefined}
            maxLength={120}
          />
          <Field
            label="Описание"
            placeholder="Пропылесосить и протереть пыль"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
          />

          <AmountField
            value={amount}
            onChange={setAmount}
            label="Вознаграждение"
            error={amountError}
          />

          <Field
            label="Дедлайн"
            placeholder="ДД.ММ.ГГГГ (необязательно)"
            keyboardType="number-pad"
            maxLength={10}
            value={deadline}
            onChangeText={(value) => {
              setDeadline(formatDateInput(value));
              setSubmitError(null);
            }}
            error={deadlineError ?? undefined}
            hint="Если пусто — без ограничения времени"
          />

          <View className="gap-2">
            <Text className="text-label-md font-inter-semibold text-on-surface-variant">
              Исполнитель
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected: assignedChildId === null }}
                onPress={() => setAssignedChildId(null)}
                className={`rounded-xl px-3 py-2 ${
                  assignedChildId === null ? 'bg-primary-container' : 'bg-surface-low'
                }`}>
                <Text
                  className={`text-label-md font-inter-semibold ${
                    assignedChildId === null ? 'text-on-primary' : 'text-on-surface-variant'
                  }`}>
                  Любой ребёнок
                </Text>
              </Pressable>

              {children.map((child) => {
                const selected = assignedChildId === child.id;

                return (
                  <Pressable
                    key={child.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => setAssignedChildId(child.id)}
                    className={`rounded-xl px-3 py-2 ${
                      selected ? 'bg-primary-container' : 'bg-surface-low'
                    }`}>
                    <Text
                      className={`text-label-md font-inter-semibold ${
                        selected ? 'text-on-primary' : 'text-on-surface-variant'
                      }`}>
                      {getFirstName(child.name)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <CardPicker
            cards={cards}
            value={cardId}
            onChange={setCardId}
            label="Списать вознаграждение с карты"
          />

          {submitError ? (
            <View className="flex-row items-center gap-1.5">
              <Icon name="error-outline" size={14} color="#BA1A1A" />
              <Text className="flex-1 text-label-sm font-inter text-error">{submitError}</Text>
            </View>
          ) : null}

          <Button
            label="Создать задание"
            icon="add-task"
            size="lg"
            className="h-[52px] w-full rounded-xl"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
          />
        </View>
      )}
    </ModalSheet>
  );
}
