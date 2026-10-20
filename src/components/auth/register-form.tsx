import { useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';

const PHONE_LENGTH = 9;

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type FieldKey = 'fullName' | 'phone' | 'login' | 'password' | 'terms';
type FormErrors = Partial<Record<FieldKey, string>>;

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, PHONE_LENGTH);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 5) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
}

type RegisterFormProps = {
  onSubmit: () => void;
  onOpenPolicy: () => void;
};

export function RegisterForm({ onSubmit, onOpenPolicy }: RegisterFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
    if (phone.replace(/\D/g, '').length < PHONE_LENGTH) {
      next.phone = 'Введите номер полностью';
    }
    if (login.trim().length < 3) {
      next.login = 'Логин — минимум 3 символа';
    } else if (/\s/.test(login.trim())) {
      next.login = 'Логин без пробелов';
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

  const handleSubmit = () => {
    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmit();
    }, 700);
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
        trailing={<Icon name="phone-iphone" size={20} color="#737686" />}
      />

      <Field
        label="Придумайте логин"
        icon="alternate-email"
        placeholder="login_user"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect={false}
        value={login}
        onChangeText={(value) => {
          setLogin(value);
          clearError('login');
        }}
        error={errors.login}
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
            <Text className="text-body-sm leading-tight text-on-surface-variant">
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
              МТБанка
            </Text>
          }
        />
      </View>

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
