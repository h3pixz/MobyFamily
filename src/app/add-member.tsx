import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddMemberIntro } from '@/components/family/add-member-intro';
import { BankSecurityNote } from '@/components/family/bank-security-note';
import { ChildContactCard } from '@/components/family/child-contact-card';
import { ChildVerificationCard } from '@/components/family/child-verification-card';
import { FamilyHeader } from '@/components/family/family-header';
import { Button } from '@/components/ui/button';
import { isPhoneComplete } from '@/utils/phone';

const VERIFY_DURATION = 1200;
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
  const [fileName, setFileName] = useState<string | null>(null);
  const [state, setState] = useState<SubmitState>('idle');
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
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (picked.canceled) {
      return;
    }

    setFileName(picked.assets[0].fileName ?? 'Документ.jpg');
  };

  const submit = () => {
    Keyboard.dismiss();
    setState('verifying');
    timer.current = setTimeout(() => {
      setState('done');
      timer.current = setTimeout(goBack, SUCCESS_DURATION);
    }, VERIFY_DURATION);
  };

  const ready = isPhoneComplete(phone) && Boolean(fileName);

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

        <ChildVerificationCard fileName={fileName} onPressPick={pickDocument} />

        <BankSecurityNote />

        <View className="gap-3">
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
