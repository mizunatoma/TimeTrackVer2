# Time Track Log 🕰️

資格勉強中に愛用していたタイムログアプリをヒントに、**PCブラウザで使えるシンプルなタイムトラッキングツール**を自作しました。作業時間の記録・可視化・Todoリスト管理を1画面で完結できます。

## デモ・スクリーンショット

[➡️ デプロイリンク](https://my-original-946wi5kzv-tomiiii-coders-projects.vercel.app/)　ゲストログインで試せます！

---

### ログイン画面
![ログイン画面](image.png)

### タイムログ画面
![タイムログ画面](image-1.png)

認証・記録デモ：https://www.loom.com/share/503c9dd329774a62add25db48cf0e61e

### Todoメモ（サイドバー）
![Todoメモ（サイドバー）](image-3.png)

操作デモ：https://www.loom.com/share/d71667f6e03240459a9c1ab7fa6e0306

### アナリティクス画面
![アナリティクス画面](image-2.png)

操作デモ：https://www.loom.com/share/b180f90524f74925a680b1db5c0332af

## 機能・特徴

- 📝 **タイムログ**と**Todoリスト**を併せた、シンプルな構成
- 👀 **月次アナリティクス**で、合計時間を可視化
- ✅ カテゴリ別に Todoを管理

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript 5 |
| UI | React 18 |
| スタイリング | Tailwind CSS 3 |
| アイコン | Lucide React |
| 認証・BaaS | Supabase |
| ORM | Prisma 6 |
| DB | PostgreSQL |
| フォーム | React Hook Form + Zod |
| データフェッチ | SWR |
| グラフ | Recharts |
| デプロイ | Vercel |

## 設計資料

- [画面遷移図（Figma）](https://www.figma.com/design/YJQt8LYCqSwFhkYdEs2MHG/%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%8A%E3%83%AB%E3%82%A2%E3%83%97%E3%83%AA?node-id=0-1&t=l5ccdrvYg4QZij3C-1)
- [ER図（Miro）](https://miro.com/app/live-embed/uXjVHNQ2Yso=/?embedMode=view_only_without_ui&moveToViewport=-854%2C-893%2C1548%2C1388&embedId=575390242521)
