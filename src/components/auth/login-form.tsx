import { useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';

const shadow = {
  shadowColor: '#0F172A',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
};

type FieldKey = 'login' | 'password';
type FormErrors = Partial<Record<FieldKey, string>>;

type LoginFormProps = {
  onSubmit: () => void;
  onForgotPassword: () => void;
};

export function LoginForm({ onSubmit, onForgotPassword }: LoginFormProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [remembered, setRemembered] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (key: FieldKey) => {
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const handleSubmit = () => {
    const next: FormErrors = {};

    if (!login.trim()) {
      next.login = 'Введите логин или номер телефона';
    }
    if (!password) {
      next.password = 'Введите пароль';
    }

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
        label="Логин или номер телефона"
        icon="alternate-email"
        placeholder="Введите логин или телефон"
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
        label="Пароль"
        icon="lock"
        placeholder="••••••••"
        autoComplete="current-password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          clearError('password');
        }}
        error={errors.password}
        labelAccessory={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Забыли пароль?"
            onPress={onForgotPassword}
            hitSlop={8}>
            <Text className="text-label-sm font-inter-medium text-primary-container">
              Забыли пароль?
            </Text>
          </Pressable>
        }
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

      <Checkbox
        checked={remembered}
        onChange={setRemembered}
        accessibilityLabel="Запомнить меня"
        labelNode={
          <Text className="text-body-sm text-on-surface">Запомнить меня</Text>
        }
      />

      <View className="pt-1">
        <Button
          label={submitting ? 'Входим…' : 'Войти'}
          icon="arrow-forward"
          size="xl"
          className="w-full"
          loading={submitting}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}
