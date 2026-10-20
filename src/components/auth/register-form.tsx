import { useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';

import { getApiErrorMessage } from '@/api/error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { formatPhone, isPhoneComplete } from '@/utils/phone';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type FieldKey = 'fullName' | 'phone' | 'birthDay' | 'password' | 'terms';
type FormErrors = Partial<Record<FieldKey, string>>;

type RegisterFormProps = {
  onSubmit: (data: {
    name: string;
    phone: string;
    birthDay: string;
    password: string;
  }) => Promise<void>;
  onOpenPolicy: () => void;
};

function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

function toIsoDate(value: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function RegisterForm({ onSubmit, onOpenPolicy }: RegisterFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (key: FieldKey) => {
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (fullName.trim().length < 3) {
      next.fullName = 'Укажите имя и фамилию';
    }
    if (!isPhoneComplete(phone)) {
      next.phone = 'Введите номер полностью';
    }
    if (!toIsoDate(birthDay)) {
      next.birthDay = 'Укажите дату в формате ДД.ММ.ГГГГ';
    }
    if (password.length < 8) {
      next.password = 'Пароль — минимум 8 символов';
    } else if (!/[a-zа-яё]/i.test(password) || !/\d/.test(password)) {
      next.password = 'Добавьте в пароль буквы и цифры';
    }
    if (!accepted) {
      next.terms = 'Отметьте согласие с условиями';
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

    Keyboard.dismiss();
    setSubmitting(true);
    setFormError(null);

    try {
      await onSubmit({
        name: fullName.trim(),
        phone,
        birthDay: isoBirthDay,
        password,
      });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="gap-4 rounded-2xl bg-surface-lowest p-5" style={shadow}>
      <Field
        label="ФИО"
        icon="person"
        placeholder="Иванов Иван Иванович"
        autoComplete="name"
        autoCapitalize="words"
        value={fullName}
        onChangeText={(value) => {
          setFullName(value);
          clearError('fullName');
        }}
        error={errors.fullName}
      />

      <Field
        label="Номер телефона"
        placeholder="(29) 000-00-00"
        keyboardType="phone-pad"
        autoComplete="tel"
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
        label="Дата рождения"
        icon="cake"
        placeholder="ДД.ММ.ГГГГ"
        keyboardType="number-pad"
        maxLength={10}
        value={birthDay}
        onChangeText={(value) => {
          setBirthDay(formatBirthDate(value));
          clearError('birthDay');
        }}
        error={errors.birthDay}
      />

      <Field
        label="Придумайте пароль"
        icon="lock"
        placeholder="••••••••"
        autoComplete="new-password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          clearError('password');
        }}
        error={errors.password}
        hint="Не менее 8 символов, цифры и буквы"
        trailing={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            onPress={() => setShowPassword((current) => !current)}
            hitSlop={4}
            className="-mr-2 h-11 w-11 items-center justify-center">
            <Icon
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={20}
              color="#737686"
            />
          </Pressable>
        }
      />

      <View className="pt-1">
        <Checkbox
          checked={accepted}
          onChange={(value) => {
            setAccepted(value);
            clearError('terms');
          }}
          error={errors.terms}
          accessibilityLabel="Согласие с условиями обслуживания и политикой конфиденциальности"
          labelNode={
            <Text className="text-body-sm font-inter leading-tight text-on-surface-variant">
              Я согласен с{' '}
              <Text
                accessibilityRole="link"
                onPress={onOpenPolicy}
                className="font-inter-medium text-primary underline">
                условиями обслуживания
              </Text>{' '}
              и{' '}
              <Text
                accessibilityRole="link"
                onPress={onOpenPolicy}
                className="font-inter-medium text-primary underline">
                политикой конфиденциальности
              </Text>{' '}
              МТбанка
            </Text>
          }
        />
      </View>

      {formError ? (
        <View className="flex-row items-center gap-1.5 rounded-xl bg-error/10 px-3 py-2.5">
          <Icon name="error-outline" size={16} color="#BA1A1A" />
          <Text className="flex-1 text-label-sm font-inter text-error">{formError}</Text>
        </View>
      ) : null}

      <View className="pt-1">
        <Button
          label={submitting ? 'Регистрируем…' : 'Зарегистрироваться'}
          icon="arrow-forward"
          size="lg"
          className="w-full"
          loading={submitting}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}
