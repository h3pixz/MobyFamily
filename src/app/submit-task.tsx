import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { isChildRole } from '@/api/auth';
import { getApiErrorMessage } from '@/api/error';
import { fetchFamily } from '@/api/family';
import type { CardDto } from '@/api/gen/models/CardDto';
import { fetchTask, submitTask } from '@/api/tasks';
import { useAuth } from '@/auth/auth-context';
import { CardPicker } from '@/components/money/card-picker';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { ModalSheet } from '@/components/ui/modal-sheet';

type Photo = {
  uri: string;
  base64: string | null;
  mimeType: string | null;
};

export default function SubmitTaskScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { profile } = useAuth();
  const isChild = isChildRole(profile?.role ?? '');

  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [cards, setCards] = useState<CardDto[]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoadError('Задание не найдено');
      setLoading(false);
      return;
    }

    let cancelled = false;

    Promise.allSettled([fetchTask(id), fetchFamily()]).then(
      ([taskResult, familyResult]) => {
        if (cancelled) {
          return;
        }

        if (taskResult.status === 'fulfilled') {
          setTitle(taskResult.value.title);
        }

        if (familyResult.status === 'fulfilled') {
          setCards(familyResult.value.user.cards);
          setCardId(familyResult.value.user.cards[0]?.id ?? null);
        }

        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [id]);

  const close = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/child');
  };

  const pickPhoto = async () => {
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.3,
        base64: true,
      });

      if (picked.canceled) {
        return;
      }

      const asset = picked.assets[0];

      setPhoto({
        uri: asset.uri,
        base64: asset.base64 ?? null,
        mimeType: asset.mimeType ?? 'image/jpeg',
      });
    } catch {
      Alert.alert('Не удалось выбрать фото', 'Попробуйте ещё раз.');
    }
  };

  const canSubmit = isChild && Boolean(id) && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !id) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const photoUrl = photo
      ? photo.base64
        ? `data:${photo.mimeType ?? 'image/jpeg'};base64,${photo.base64}`
        : photo.uri
      : undefined;

    try {
      const response = await submitTask(id, {
        comment: comment.trim() || undefined,
        photoUrl,
        targetCardId: cardId ?? undefined,
      });

      Alert.alert('Отчёт отправлен', response.message, [{ text: 'ОК', onPress: close }]);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  if (!isChild) {
    return (
      <ModalSheet title="Отчёт о задании" onClose={close}>
        <View className="items-center gap-2 rounded-xl bg-surface-low px-4 py-6">
          <Icon name="info-outline" size={26} color="#1D63ED" />
          <Text className="text-center text-body-md font-inter text-on-surface-variant">
            Отправлять отчёт могут только дети и подростки.
          </Text>
        </View>
      </ModalSheet>
    );
  }

  return (
    <ModalSheet
      title="Отчёт о выполнении"
      subtitle={title || 'Прикрепите фото и комментарий'}
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
            label="Комментарий"
            placeholder="Я всё сделал!"
            value={comment}
            onChangeText={(value) => {
              setComment(value);
              setSubmitError(null);
            }}
            multiline
            maxLength={500}
          />

          {photo ? (
            <View className="gap-2">
              <Image
                source={{ uri: photo.uri }}
                contentFit="cover"
                style={{ width: '100%', height: 150, borderRadius: 12 }}
              />
              <Button
                label="Убрать фото"
                icon="delete-outline"
                variant="secondary"
                onPress={() => setPhoto(null)}
              />
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Прикрепить фото отчёта"
              onPress={pickPhoto}
              className="flex-row items-center gap-3 rounded-xl border border-dashed border-outline-variant/60 bg-surface-low px-4 py-4"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
              <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed">
                <Icon name="add-a-photo" size={20} color="#004BC3" />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-label-md font-inter-semibold text-on-surface">
                  Прикрепить фото отчёта
                </Text>
                <Text className="text-label-sm font-inter text-on-surface-variant">
                  Необязательно, но родителю будет приятнее
                </Text>
              </View>
            </Pressable>
          )}

          <CardPicker
            cards={cards}
            value={cardId}
            onChange={setCardId}
            label="Зачислить награду на карту"
          />

          {submitError ? (
            <View className="flex-row items-center gap-1.5">
              <Icon name="error-outline" size={14} color="#BA1A1A" />
              <Text className="flex-1 text-label-sm font-inter text-error">{submitError}</Text>
            </View>
          ) : null}

          <Button
            label="Отправить на проверку"
            icon="send"
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
