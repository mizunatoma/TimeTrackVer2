import * as jose from 'jose'

// JWTを作成する関数
export async function signJWT(userId: string, isGuest?: boolean) {
  const alg = 'HS256'
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const jwt = await new jose.SignJWT({ userId, isGuest }) // JWTに userId, isGuest のキーを追加
    // Base64は誰でもデコードできるので、キーについて、改ざんはできないが閲覧される可能性あり
    .setProtectedHeader({ alg })
    .setIssuedAt() // 発行日時を記録する
    .setExpirationTime('24h') // サーバーが「このトークンがいつ失効するか」を検証する
    .sign(secret)
  return jwt
}

// JWTを検証して中身を返す関数
export async function jwtVerify(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const { payload } = await jose.jwtVerify<{
    userId: string
    isGuest: boolean
  }>(token, secret)
  return { payload }
}

// cookieオプション
export const JWT_COOKIE_OPTIONS = {
  // JSで読めなくなる （XSS対策）
  httpOnly: true,
  // 本番環境ではHTTPS通信のみCookie送信 （盗聴対策）
  secure: process.env.NODE_ENV === 'production',
  // 別サイトからの不正リクエストを抑制する （CSRF対策）
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24, // 有効期限（秒）// ブラウザが「このCookieをいつ消すか」を知る
  path: '/',
}
