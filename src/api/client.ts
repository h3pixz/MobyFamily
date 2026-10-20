import Constants from 'expo-constants';

import { client } from './gen/.kubb/client';
import { getAccessToken } from './session';

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

client.setConfig({
  baseURL: resolveBaseURL(),
  auth: () => getAccessToken() ?? undefined,
});
