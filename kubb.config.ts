import { defineConfig } from 'kubb/config'
import { pluginFetch } from '@kubb/plugin-fetch'
import { pluginTs } from '@kubb/plugin-ts'

export default defineConfig({
  input: './openapi.json',
  output: { path: './src/api/gen', clean: true },
  plugins: [
    pluginTs({ output: { path: 'models' } }),
    pluginFetch({
      output: { path: 'clients', barrel: { type: 'named' } },
      returnType: 'data',
    }),
  ],
})
