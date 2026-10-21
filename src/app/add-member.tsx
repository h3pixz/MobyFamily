import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/error';
import { addChild, linkChild, type PassportFile } from '@/api/family';
import { useAuth } from '@/auth/auth-context';
import { AddChildForm, type AddChildInput } from '@/components/family/add-child-form';
import { AddMemberIntro } from '@/components/family/add-member-intro';
import { BankSecurityNote } from '@/components/family/bank-security-note';
import { ChildContactCard } from '@/components/family/child-contact-card';
import { ChildVerificationCard } from '@/components/family/child-verification-card';
import { FamilyHeader } from '@/components/family/family-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { isPhoneComplete } from '@/utils/phone';

const SUCCESS_DURATION = 1600;

type Mode = 'link' | 'create';

type SubmitState = 'idle' | 'verifying' | 'done';

const submitLabels: Record<SubmitState, string> = {
  idle: 'Добавить ребёнка',
  verifying: 'Проверка данных…',
  done: 'Заявка отправлена',
};

export default function AddMemberScreen() {
  const insets = useSafeAreaInsets();
  const { refreshProfile } = useAuth();
  const [mode, setMode] = useState<Mode>('link');
  const [phone, setPhone] = useState('');
  const [passport, setPassport] = useState<PassportFile | null>(null);
  const [state, setState] = useState<SubmitState>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/family');
  };

  const pickDocument = async () => {
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (picked.canceled) {
        return;
      }

      const asset = picked.assets[0];

      setPassport({
        uri: asset.uri,
        name: asset.fileName ?? 'Документ.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      });
      setFormError(null);
    } catch {
      setFormError('Не удалось выбрать файл. Попробуйте ещё раз.');
    }
  };

  const submit = async () => {
    if (!passport) {
      return;
    }

    Keyboard.dismiss();
    setState('verifying');
    setFormError(null);

    try {
      await linkChild({ phone, passport });
      await refreshProfile().catch(() => {});
      setState('done');
      timer.current = setTimeout(goBack, SUCCESS_DURATION);
    } catch (error) {
      setState('idle');
      setFormError(getApiErrorMessage(error));
    }
  };

  const handleCreateChild = async (input: AddChildInput) => {
    const response = await addChild(input);
    await refreshProfile().catch(() => {});
    Alert.alert('Ребёнок добавлен', response.message, [{ text: 'ОК', onPress: goBack }]);
  };

  const ready = isPhoneComplete(phone) && Boolean(passport);

  return (
    <View className="flex-1 bg-surface">
      <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top }}>
        <FamilyHeader
          title="Добавить ребёнка"
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row rounded-xl bg-surface-low p-1">
          {(
            [
              { key: 'link', label: 'Привязать' },
              { key: 'create', label: 'Создать' },
            ] as const
          ).map((item) => {
            const selected = mode === item.key;

            return (
              <Pressable
                key={item.key}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setMode(item.key)}
                className={`flex-1 items-center rounded-lg py-2.5 ${
                  selected ? 'bg-primary-container' : ''
                }`}
                style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
                <Text
                  className={`text-label-md font-inter-semibold ${
                    selected ? 'text-on-primary' : 'text-on-surface-variant'
                  }`}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {mode === 'create' ? (
          <>
            <Text className="text-body-sm font-inter text-on-surface-variant">
              Создайте аккаунт ребёнка: виртуальная карта выпустится автоматически, а вы получите
              роль родителя.
            </Text>
            <AddChildForm onSubmit={handleCreateChild} />
            <BankSecurityNote />
          </>
        ) : (
          <>
            <AddMemberIntro />

            <ChildContactCard
              phone={phone}
              complete={isPhoneComplete(phone)}
              onChangePhone={setPhone}
            />

            <ChildVerificationCard fileName={passport?.name ?? null} onPressPick={pickDocument} />

            <BankSecurityNote />

            <View className="gap-3">
              {formError ? (
                <View className="flex-row items-center gap-1.5 rounded-xl bg-error/10 px-3 py-2.5">
                  <Icon name="error-outline" size={16} color="#BA1A1A" />
                  <Text className="flex-1 text-label-sm font-inter text-error">{formError}</Text>
                </View>
              ) : null}

              <Button
                label={submitLabels[state]}
                icon={state === 'verifying' ? undefined : state === 'done' ? 'check' : 'person-add'}
                size="xl"
                className="w-full"
                loading={state === 'verifying'}
                disabled={!ready || state !== 'idle'}
                onPress={submit}
              />
              <Text className="text-center text-label-sm font-inter text-outline">
                Нажимая кнопку, вы подтверждаете согласие на обработку персональных данных
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
