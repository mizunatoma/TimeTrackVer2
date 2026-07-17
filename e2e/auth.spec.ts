import { expect, test } from '@playwright/test'

test('ゲストログインでタイムラインに到達する', async ({ page }) => {
  // 1. /signinを開く
  await page.goto('/signin')
  // 2. 「ゲストで見る」ボタンをつかんでクリック
  await page.getByRole('button', { name: 'ゲストで見る' }).click()
  // 3. /user/timeline に遷移したか検証
  await expect(page).toHaveURL('/user/timeline')
})

test('新規登録後ログインし、そのままCategoryを追加・Trackingを開始できる', async ({
  page,
}) => {
  // 1. 新規登録
  const email = `e2e-${Date.now()}@example.com` // 2回目以降のエラーを避けるため、都度作成
  await page.goto('/signup')
  await page.getByLabel('メールアドレス').fill(email)
  await page
    .getByRole('textbox', { name: 'パスワード', exact: true })
    .fill('passwordTest')
  await page.getByLabel('パスワード(確認)').fill('passwordTest')
  await page.getByRole('button', { name: '新規登録' }).click()
  await expect(page).toHaveURL('/signin')
  // 2. ログイン
  await page.getByLabel('メールアドレス').fill(email)
  await page.getByLabel('パスワード').fill('passwordTest')
  await page.getByRole('button', { name: 'ログイン' }).click()
  await expect(page).toHaveURL('/user/timeline')
  // 3. category を作成
  await page.getByRole('button', { name: '追加' }).click()
  await page.getByPlaceholder("Category's name").fill('TestCategory')
  await page.getByRole('button', { name: '保存' }).click()
  // 4. Tracking を開始
  await page.getByText('TestCategory').click()
  await expect(page.getByText(/開始:/)).toBeVisible()
})

test('未ログインで保護ページにアクセスしようとすると、/signinにリダイレクトされる', async ({
  page,
}) => {
  // 1. 未ログイン状態で保護ページを開く
  await page.goto('/user/timeline')
  // 2. middlewareで /signin に飛ばされることを検証
  await expect(page).toHaveURL('/signin')
})

test('登録済みユーザ情報でログインする', async ({ page }) => {
  // 1. goto('/signin')
  await page.goto('/signin')
  // 2. メール欄に .fill(ゲストのメール)
  await page.getByLabel('メールアドレス').fill(`${process.env.GUEST_EMAIL}`)
  // 3. パスワード欄に .fill(ゲストのパスワード)
  await page.getByLabel('パスワード').fill(`${process.env.GUEST_PASSWORD}`)
  // 4. 送信ボタンを .click()
  await page.getByRole('button', { name: 'ログイン' }).click()
  // 5. expect → toHaveURL('/user/timeline')
  await expect(page).toHaveURL('/user/timeline')
})
