import { client } from './gen/.kubb/client'

client.setConfig({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
})
