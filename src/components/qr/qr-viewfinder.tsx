import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';

import { Icon } from '@/components/ui/icon';

const laserGlow = {
  shadowColor: '#1D63ED',
  shadowOpacity: 0.85,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 0 },
  elevation: 6,
};

const bracketGlow = {
  shadowColor: '#1D63ED',
  shadowOpacity: 0.9,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 0 },
  elevation: 4,
};

const qrPattern = [
  [76, 14, 12, 12],
  [96, 14, 24, 12],
  [76, 34, 16, 14],
  [104, 34, 16, 24],
  [76, 58, 44, 12],
  [14, 76, 24, 12],
  [46, 76, 42, 14],
  [98, 76, 20, 20],
  [134, 76, 24, 12],
  [166, 76, 20, 30],
  [14, 98, 18, 24],
  [42, 98, 24, 16],
  [76, 104, 32, 20],
  [120, 104, 32, 16],
  [14, 118, 18, 10],
  [76, 134, 18, 18],
  [104, 134, 42, 14],
  [156, 116, 30, 18],
  [76, 162, 24, 24],
  [110, 158, 18, 28],
  [138, 160, 48, 26],
] as const;

type QrViewfinderProps = {
  torchOn: boolean;
  active: boolean;
  feedbackVisible: boolean;
  onBarcodeScanned: (data: string) => void;
  onDemoScan: () => void;
};

export function QrViewfinder({
  torchOn,
  active,
  feedbackVisible,
  onBarcodeScanned,
  onDemoScan,
}: QrViewfinderProps) {
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const [requesting, setRequesting] = useState(false);
  const [mountError, setMountError] = useState<string | null>(null);
  const laserY = useSharedValue(12);

  useEffect(() => {
    laserY.value = withRepeat(
      withTiming(262, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );

    return () => cancelAnimation(laserY);
  }, [laserY]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        getPermission();
      }
    });

    return () => subscription.remove();
  }, [getPermission]);

  const laserStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: laserY.value }],
  }));

  const handleRequestPermission = async () => {
    setRequesting(true);
    try {
      await requestPermission();
    } finally {
      setRequesting(false);
    }
  };

  const cameraReady = permission?.granted && active;

  return (
    <View className="h-72 w-72 items-center justify-center overflow-hidden rounded-3xl bg-on-surface">
      {cameraReady ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torchOn}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={
            feedbackVisible ? undefined : (result) => onBarcodeScanned(result.data)
          }
          onMountError={(event) => setMountError(event.message)}
        />
      ) : null}

      {permission === null ? (
        <ActivityIndicator color="#F0F1F3" />
      ) : !permission.granted ? (
        <View className="absolute inset-0 items-center justify-center gap-2.5 px-6">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-fixed">
            <Icon name="camera-alt" size={24} color="#004BC3" />
          </View>
          <Text className="text-center text-label-lg font-inter-semibold text-inverse-on-surface">
            Нужен доступ к камере
          </Text>
          <Text className="text-center text-body-sm font-inter leading-snug text-inverse-on-surface/60">
            Разрешите камеру, чтобы сканировать QR-коды
          </Text>

          {requesting ? (
            <ActivityIndicator color="#F0F1F3" />
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={permission.canAskAgain ? handleRequestPermission : () => Linking.openSettings()}
              className="mt-1 rounded-full bg-primary-container px-4 py-2"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}>
              <Text className="text-label-md font-inter-semibold text-on-primary">
                {permission.canAskAgain ? 'Разрешить доступ' : 'Открыть настройки'}
              </Text>
            </Pressable>
          )}
        </View>
      ) : !active ? (
        <View className="absolute inset-0 items-center justify-center gap-2">
          <Icon name="photo-camera" size={28} color="rgba(240,241,243,0.5)" />
          <Text className="text-body-sm font-inter text-inverse-on-surface/50">Камера на паузе</Text>
        </View>
      ) : null}

      {cameraReady ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Сканировать QR-код"
          onPress={onDemoScan}
          className="absolute inset-0"
        />
      ) : null}

      <View pointerEvents="none" className="absolute inset-8 items-center justify-center opacity-25">
        <Svg width="100%" height="100%" viewBox="0 0 200 200">
          <Rect x="10" y="10" width="56" height="56" rx="10" fill="#EEF0FF" />
          <Rect x="22" y="22" width="32" height="32" rx="4" fill="#12161C" />
          <Rect x="30" y="30" width="16" height="16" rx="2" fill="#EEF0FF" />
          <Rect x="134" y="10" width="56" height="56" rx="10" fill="#EEF0FF" />
          <Rect x="146" y="22" width="32" height="32" rx="4" fill="#12161C" />
          <Rect x="154" y="30" width="16" height="16" rx="2" fill="#EEF0FF" />
          <Rect x="10" y="134" width="56" height="56" rx="10" fill="#EEF0FF" />
          <Rect x="22" y="146" width="32" height="32" rx="4" fill="#12161C" />
          <Rect x="30" y="154" width="16" height="16" rx="2" fill="#EEF0FF" />
          {qrPattern.map(([x, y, width, height]) => (
            <Rect key={`${x}-${y}`} x={x} y={y} width={width} height={height} rx={2} fill="#EEF0FF" />
          ))}
        </Svg>
      </View>

      <View pointerEvents="none" className="absolute left-4 top-4 h-9 w-9">
        <View className="absolute left-0 top-0 h-1.5 w-9 rounded-full bg-primary-container" style={bracketGlow} />
        <View className="absolute left-0 top-0 h-9 w-1.5 rounded-full bg-primary-container" style={bracketGlow} />
      </View>
      <View pointerEvents="none" className="absolute right-4 top-4 h-9 w-9">
        <View className="absolute right-0 top-0 h-1.5 w-9 rounded-full bg-primary-container" style={bracketGlow} />
        <View className="absolute right-0 top-0 h-9 w-1.5 rounded-full bg-primary-container" style={bracketGlow} />
      </View>
      <View pointerEvents="none" className="absolute bottom-4 left-4 h-9 w-9">
        <View className="absolute bottom-0 left-0 h-1.5 w-9 rounded-full bg-primary-container" style={bracketGlow} />
        <View className="absolute bottom-0 left-0 h-9 w-1.5 rounded-full bg-primary-container" style={bracketGlow} />
      </View>
      <View pointerEvents="none" className="absolute bottom-4 right-4 h-9 w-9">
        <View className="absolute bottom-0 right-0 h-1.5 w-9 rounded-full bg-primary-container" style={bracketGlow} />
        <View className="absolute bottom-0 right-0 h-9 w-1.5 rounded-full bg-primary-container" style={bracketGlow} />
      </View>

      <Animated.View
        pointerEvents="none"
        className="absolute left-3 right-3 top-0 h-0.5"
        style={[laserStyle, laserGlow]}>
        <LinearGradient
          colors={['transparent', '#DBE1FF', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 2 }}
        />
      </Animated.View>

      {mountError ? (
        <View pointerEvents="none" className="absolute inset-x-4 bottom-4 rounded-xl bg-black/60 px-3 py-2">
          <Text className="text-center text-label-sm font-inter text-inverse-on-surface">
            Не удалось открыть камеру
          </Text>
        </View>
      ) : null}

      {feedbackVisible ? (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center bg-primary-container/25">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-container shadow-xl">
            <Icon name="check" size={36} color="#FFFFFF" />
          </View>
        </View>
      ) : null}
    </View>
  );
}
