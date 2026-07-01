import { expect, test } from '@playwright/test'

test('ゲストログインでタイムラインに到達する', async ({ page }) => {
  // 1. /signinを開く
  await page.goto('/signin')
  // 2. 「ゲストで見る」ボタンをつかんでクリック
  await page.getByRole('button', { name: 'ゲストで見る' }).click()
  // 3. /user/timeline に遷移したか検証
  await expect(page).toHaveURL('/user/timeline')
})
