import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getApiErrorMessage } from '@/api/error';
import { linkChild, type PassportFile } from '@/api/family';
import { AddMemberIntro } from '@/components/family/add-member-intro';
import { BankSecurityNote } from '@/components/family/bank-security-note';
import { ChildContactCard } from '@/components/family/child-contact-card';
import { ChildVerificationCard } from '@/components/family/child-verification-card';
import { FamilyHeader } from '@/components/family/family-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { isPhoneComplete } from '@/utils/phone';

const SUCCESS_DURATION = 1600;

type SubmitState = 'idle' | 'verifying' | 'done';

const submitLabels: Record<SubmitState, string> = {
  idle: 'Добавить ребёнка',
  verifying: 'Проверка данных…',
  done: 'Заявка отправлена',
};

export default function AddMemberScreen() {
  const insets = useSafeAreaInsets();
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
      setState('done');
      timer.current = setTimeout(goBack, SUCCESS_DURATION);
    } catch (error) {
      setState('idle');
      setFormError(getApiErrorMessage(error));
    }
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
      </ScrollView>
    </View>
  );
}
