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
let persistSession = false;

const sessionExpiredListeners = new Set<() => void>();

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

async function deleteStoredItems() {
  await Promise.all([
    deleteItem(ACCESS_TOKEN_KEY),
    deleteItem(REFRESH_TOKEN_KEY),
    deleteItem(PROFILE_NAME_KEY),
  ]);
}

async function writeTokens(tokens: Tokens) {
  await Promise.all([
    writeItem(ACCESS_TOKEN_KEY, tokens.accessToken),
    writeItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

export async function loadSession() {
  accessToken = await readItem(ACCESS_TOKEN_KEY);
  refreshToken = await readItem(REFRESH_TOKEN_KEY);
  profileName = await readItem(PROFILE_NAME_KEY);
  persistSession = Boolean(accessToken);
}

export async function saveSession(tokens: Tokens, persist = true, name?: string) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
  profileName = name ?? null;
  persistSession = persist;

  if (!persist) {
    await deleteStoredItems();
    return;
  }

  const writes = [writeTokens(tokens)];

  if (name) {
    writes.push(writeItem(PROFILE_NAME_KEY, name));
  }

  await Promise.all(writes);
}

export async function updateSessionTokens(tokens: Tokens) {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;

  if (persistSession) {
    await writeTokens(tokens);
  }
}

export async function clearSession() {
  accessToken = null;
  refreshToken = null;
  profileName = null;
  persistSession = false;

  await deleteStoredItems();
}

export async function expireSession() {
  await clearSession();
  sessionExpiredListeners.forEach((listener) => listener());
}

export function onSessionExpired(listener: () => void) {
  sessionExpiredListeners.add(listener);

  return () => {
    sessionExpiredListeners.delete(listener);
  };
}
