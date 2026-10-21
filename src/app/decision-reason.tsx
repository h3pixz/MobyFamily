import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { getApiErrorMessage } from '@/api/error';
import { declineTransferRequest } from '@/api/payments';
import { rejectTask } from '@/api/tasks';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { ModalSheet } from '@/components/ui/modal-sheet';

export default function DecisionReasonScreen() {
  const params = useLocalSearchParams<{ kind?: string; id?: string; title?: string }>();
  const isTask = params.kind === 'task';
  const id = params.id;
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const trimmedReason = reason.trim();
  const canSubmit = Boolean(id) && !submitting && (!isTask || trimmedReason.length > 0);

  const handleSubmit = async () => {
    if (!canSubmit || !id) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (isTask) {
        await rejectTask(id, trimmedReason);
      } else {
        await declineTransferRequest(id, trimmedReason || undefined);
      }

      Alert.alert(
        isTask ? 'Задача отправлена на доработку' : 'Запрос отклонён',
        undefined,
        [{ text: 'ОК', onPress: close }],
      );
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
      setSubmitting(false);
    }
  };

  return (
    <ModalSheet
      title={isTask ? 'Отправить на доработку' : 'Отклонить запрос'}
      subtitle={params.title}
      onClose={close}>
      <View className="gap-3.5">
        <Field
          label="Причина"
          placeholder={
            isTask ? 'Что нужно доделать?' : 'Можно оставить пустым'
          }
          value={reason}
          onChangeText={(value) => {
            setReason(value);
            setError(null);
          }}
          maxLength={500}
          multiline
          autoFocus
        />

        {error ? (
          <View className="flex-row items-center gap-1.5">
            <Icon name="error-outline" size={14} color="#BA1A1A" />
            <Text className="flex-1 text-label-sm font-inter text-error">{error}</Text>
          </View>
        ) : null}

        <Button
          label={isTask ? 'Отправить на доработку' : 'Отклонить'}
          variant="warning"
          size="lg"
          className="h-[52px] w-full rounded-xl"
          loading={submitting}
          disabled={!canSubmit}
          onPress={handleSubmit}
        />
      </View>
    </ModalSheet>
  );
}
