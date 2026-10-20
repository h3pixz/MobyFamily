import { client } from './gen/.kubb/client';
import { getAccessToken } from './session';

client.setConfig({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  auth: () => getAccessToken() ?? undefined,
});
