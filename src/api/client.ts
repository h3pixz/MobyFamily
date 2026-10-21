import Constants from 'expo-constants';

import {
  ResponseError,
  client,
  defaultTransport,
  type ResolvedRequest,
  type TransportResult,
} from './gen/.kubb/client';
import { authControllerRefresh } from './gen/clients/authControllerRefresh';
import { expireSession, getAccessToken, getRefreshToken, updateSessionTokens } from './session';

const DEV_API_PORT = 3000;

function resolveBaseURL() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return undefined;
  }

  const host = hostUri.replace(/^[a-z]+:\/\//, '').split(':')[0];

  return `http://${host}:${DEV_API_PORT}`;
}

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function performRefresh(): Promise<string | null> {
  const storedRefreshToken = getRefreshToken();

  if (!storedRefreshToken) {
    return null;
  }

  try {
    const tokens = await authControllerRefresh({
      body: { refreshToken: storedRefreshToken },
      client,
      transport: defaultTransport,
      auth: () => undefined,
    });

    await updateSessionTokens(tokens);

    return tokens.accessToken;
  } catch (error) {
    if (ResponseError.is(error) && (error.status === 401 || error.status === 403)) {
      await expireSession();
    }

    return null;
  }
}

function hasAuthorizationHeader(headers: Record<string, string>) {
  return Object.keys(headers).some((key) => key.toLowerCase() === 'authorization');
}

function isAuthRequest(url: string) {
  return url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout');
}

async function transportWithRefresh(request: ResolvedRequest): Promise<TransportResult> {
  const result = await defaultTransport(request);

  if (result.status !== 401 || !hasAuthorizationHeader(request.headers) || isAuthRequest(request.url)) {
    return result;
  }

  const accessToken = await refreshAccessToken();

  if (!accessToken) {
    return result;
  }

  request.headers.Authorization = `Bearer ${accessToken}`;

  return defaultTransport(request);
}

client.setConfig({
  baseURL: resolveBaseURL(),
  auth: () => getAccessToken() ?? undefined,
  transport: transportWithRefresh,
});
