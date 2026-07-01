import { expect, test } from '@playwright/test'

test('ゲストログインでタイムラインに到達する', async ({ page }) => {
  // 1. /signinを開く
  await page.goto('/signin')
  // 2. 「ゲストで見る」ボタンをつかんでクリック
  await page.getByRole('button', { name: 'ゲストで見る' }).click()
  // 3. /user/timeline に遷移したか検証
  await expect(page).toHaveURL('/user/timeline')
})

test('未ログインで保護ページにアクセスしようとすると、/signinにリダイレクトされる', async ({
  page,
}) => {
  // 1. 未ログイン状態で保護ページを開く
  await page.goto('/user/timeline')
  // 2. middlewareで /signin に飛ばされることを検証
  await expect(page).toHaveURL('/signin')
})
