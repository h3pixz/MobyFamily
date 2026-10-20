import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const ACCESS_TOKEN_KEY = 'moby.accessToken';
const REFRESH_TOKEN_KEY = 'moby.refreshToken';

let accessToken: string | null = null;
let refreshToken: string | null = null;

async function readItem(key: string) {
  if (Platform.OS === 'web') {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

async function writeItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

export async function loadSession() {
  accessToken = await readItem(ACCESS_TOKEN_KEY);
  refreshToken = await readItem(REFRESH_TOKEN_KEY);
}

export async function saveSession(tokens: Tokens, persist = true) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;

  if (!persist) {
    return;
  }

  await Promise.all([
    writeItem(ACCESS_TOKEN_KEY, tokens.accessToken),
    writeItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

export async function clearSession() {
  accessToken = null;
  refreshToken = null;

  await Promise.all([deleteItem(ACCESS_TOKEN_KEY), deleteItem(REFRESH_TOKEN_KEY)]);
}
