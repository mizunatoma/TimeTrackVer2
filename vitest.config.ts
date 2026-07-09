import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // テスト中の JSX / React を変換するために必要
  plugins: [react()],
  test: {
    // srcの.test.tsだけ対象（e2eは見ない）
    include: ['src/**/*.test.{ts,tsx}'],
    // Node には無いブラウザAPI(localStorage/DOM)を疑似再現する
    environment: 'jsdom',
    // 実行時は、describe/it/expect を import なしで使えるようにする
    globals: true,
    // jest-dom のマッチャ等を全テスト前に読み込む
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      // tsconfig の "@/*": ["./src/*"] を Vitest 側にも教える
      '@': resolve(__dirname, './src'),
    },
  },
})
