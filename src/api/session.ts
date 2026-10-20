import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const ACCESS_TOKEN_KEY = 'moby.accessToken';
const REFRESH_TOKEN_KEY = 'moby.refreshToken';
const PROFILE_NAME_KEY = 'moby.profileName';

let accessToken: string | null = null;
let refreshToken: string | null = null;
let profileName: string | null = null;

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

export function getStoredProfileName() {
  return profileName;
}

export async function loadSession() {
  accessToken = await readItem(ACCESS_TOKEN_KEY);
  refreshToken = await readItem(REFRESH_TOKEN_KEY);
  profileName = await readItem(PROFILE_NAME_KEY);
}

export async function saveSession(tokens: Tokens, persist = true, name?: string) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  profileName = name ?? null;

  if (!persist) {
    return;
  }

  const writes = [
    writeItem(ACCESS_TOKEN_KEY, tokens.accessToken),
    writeItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ];

  if (name) {
    writes.push(writeItem(PROFILE_NAME_KEY, name));
  }

  await Promise.all(writes);
}

export async function clearSession() {
  accessToken = null;
  refreshToken = null;
  profileName = null;

  await Promise.all([
    deleteItem(ACCESS_TOKEN_KEY),
    deleteItem(REFRESH_TOKEN_KEY),
    deleteItem(PROFILE_NAME_KEY),
  ]);
}
