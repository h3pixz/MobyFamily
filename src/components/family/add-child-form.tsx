import { useState } from 'react';
import { Text, View } from 'react-native';

import { getApiErrorMessage } from '@/api/error';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { formatDateInput, toIsoDate } from '@/utils/date-input';
import { formatPhone, isPhoneComplete } from '@/utils/phone';
import { parseAmountInput, sanitizeAmountInput } from '@/utils/piggy-bank';

export type AddChildInput = {
  name: string;
  phone: string;
  password: string;
  birthDay: string;
  initialBalance?: number;
  dailyLimit?: number;
};

type AddChildFormProps = {
  onSubmit: (input: AddChildInput) => Promise<void>;
};

type FieldKey = 'name' | 'phone' | 'password' | 'birthDay' | 'initialBalance' | 'dailyLimit';

type FormErrors = Partial<Record<FieldKey, string>>;

export function AddChildForm({ onSubmit }: AddChildFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [dailyLimit, setDailyLimit] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const clearError = (key: FieldKey) => {
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
    setFormError(null);
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (name.trim().length < 3) {
      next.name = 'Укажите имя и фамилию';
    }
    if (!isPhoneComplete(phone)) {
      next.phone = 'Введите номер полностью';
    }
    if (password.length < 6) {
      next.password = 'Пароль — минимум 6 символов';
    }
    if (!toIsoDate(birthDay)) {
      next.birthDay = 'Укажите дату в формате ДД.ММ.ГГГГ';
    }

    return next;
  };

  const handleSubmit = async () => {
    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    const isoBirthDay = toIsoDate(birthDay);

    if (!isoBirthDay) {
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      await onSubmit({
        name: name.trim(),
        phone,
        password,
        birthDay: isoBirthDay,
        initialBalance: initialBalance ? parseAmountInput(initialBalance) : undefined,
        dailyLimit: dailyLimit ? parseAmountInput(dailyLimit) : undefined,
      });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <View className="gap-4">
      <Field
        label="Имя и фамилия"
        icon="person"
        placeholder="Иванов Иван"
        value={name}
        onChangeText={(value) => {
          setName(value);
          clearError('name');
        }}
        error={errors.name}
      />

      <Field
        label="Номер телефона"
        placeholder="(29) 000-00-00"
        keyboardType="phone-pad"
        maxLength={15}
        value={phone}
        onChangeText={(value) => {
          setPhone(formatPhone(value));
          clearError('phone');
        }}
        error={errors.phone}
        prefix={
          <View className="flex-row items-center">
            <Text className="text-[16px] leading-none">🇧🇾</Text>
            <Text className="ml-1.5 text-label-md font-inter-semibold text-on-surface">+375</Text>
            <View className="mx-2 h-4 w-px bg-surface-highest" />
          </View>
        }
      />

      <Field
        label="Пароль"
        icon="lock"
        placeholder="••••••"
        secureTextEntry
        autoComplete="new-password"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          clearError('password');
        }}
        error={errors.password}
        hint="Не менее 6 символов"
      />

      <Field
        label="Дата рождения"
        icon="cake"
        placeholder="ДД.ММ.ГГГГ"
        keyboardType="number-pad"
        maxLength={10}
        value={birthDay}
        onChangeText={(value) => {
          setBirthDay(formatDateInput(value));
          clearError('birthDay');
        }}
        error={errors.birthDay}
      />

      <Field
        label="Стартовый баланс"
        icon="account-balance-wallet"
        placeholder="0,00"
        keyboardType="decimal-pad"
        value={initialBalance}
        onChangeText={(value) => {
          setInitialBalance(sanitizeAmountInput(value));
          clearError('initialBalance');
        }}
        hint="Необязательно"
      />

      <Field
        label="Дневной лимит"
        icon="speed"
        placeholder="15,00"
        keyboardType="decimal-pad"
        value={dailyLimit}
        onChangeText={(value) => {
          setDailyLimit(sanitizeAmountInput(value));
          clearError('dailyLimit');
        }}
        hint="По умолчанию 15 BYN"
      />

      {formError ? (
        <View className="flex-row items-center gap-1.5 rounded-xl bg-error/10 px-3 py-2.5">
          <Icon name="error-outline" size={16} color="#BA1A1A" />
          <Text className="flex-1 text-label-sm font-inter text-error">{formError}</Text>
        </View>
      ) : null}

      <Button
        label="Создать ребёнка"
        icon="person-add"
        size="xl"
        className="w-full"
        loading={submitting}
        disabled={submitting}
        onPress={handleSubmit}
      />
    </View>
  );
}
