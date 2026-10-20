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

type FieldKey = 'phone' | 'password';
type FormErrors = Partial<Record<FieldKey, string>>;

type LoginFormProps = {
  onSubmit: (credentials: { phone: string; password: string; remember: boolean }) => Promise<void>;
  onForgotPassword: () => void;
};

export function LoginForm({ onSubmit, onForgotPassword }: LoginFormProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [remembered, setRemembered] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (key: FieldKey) => {
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const next: FormErrors = {};

    if (!isPhoneComplete(phone)) {
      next.phone = 'Введите номер телефона полностью';
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
    setFormError(null);

    try {
      await onSubmit({ phone, password, remember: remembered });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="gap-4 rounded-2xl bg-surface-lowest p-5" style={shadow}>
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
          <Text className="text-body-sm font-inter text-on-surface">Запомнить меня</Text>
        }
      />

      {formError ? (
        <View className="flex-row items-center gap-1.5 rounded-xl bg-error/10 px-3 py-2.5">
          <Icon name="error-outline" size={16} color="#BA1A1A" />
          <Text className="flex-1 text-label-sm font-inter text-error">{formError}</Text>
        </View>
      ) : null}

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
