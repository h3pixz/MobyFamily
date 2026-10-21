import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { isChildRole } from '@/api/auth';
import { getApiErrorMessage } from '@/api/error';
import { requestNewTask } from '@/api/tasks';
import { useAuth } from '@/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { ModalSheet } from '@/components/ui/modal-sheet';

export default function RequestTaskScreen() {
  const { profile } = useAuth();
  const isChild = isChildRole(profile?.role ?? '');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/child');
  };

  const handleSubmit = async () => {
    if (!isChild || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await requestNewTask(comment.trim() || undefined);

      Alert.alert(
        'Запрос отправлен',
        `${response.message} Родителей уведомлено: ${response.notifiedParentsCount}.`,
        [{ text: 'ОК', onPress: close }],
      );
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
      setSubmitting(false);
    }
  };

  if (!isChild) {
    return (
      <ModalSheet title="Новое задание" onClose={close}>
        <View className="items-center gap-2 rounded-xl bg-surface-low px-4 py-6">
          <Icon name="info-outline" size={26} color="#1D63ED" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            Просить задания могут только дети и подростки.
          </Text>
        </View>
      </ModalSheet>
    );
  }

  return (
    <ModalSheet
      title="Попросить задание"
      subtitle="Родители получат уведомление"
      onClose={close}>
      <View className="gap-3.5">
        <Field
          label="Пожелание"
          placeholder="Хочу накопить на велосипед, дайте задание!"
          value={comment}
          onChangeText={(value) => {
            setComment(value);
            setError(null);
          }}
          multiline
          maxLength={500}
        />

        {error ? (
          <View className="flex-row items-center gap-1.5">
            <Icon name="error-outline" size={14} color="#BA1A1A" />
            <Text className="flex-1 text-label-sm font-inter text-error">{error}</Text>
          </View>
        ) : null}

        <Button
          label="Отправить запрос"
          icon="send"
          size="lg"
          className="h-[52px] w-full rounded-xl"
          loading={submitting}
          disabled={submitting}
          onPress={handleSubmit}
        />
      </View>
    </ModalSheet>
  );
}
