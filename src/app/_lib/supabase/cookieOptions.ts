export const COOKIE_OPTIONS = {
  // JSで読めなくなる （XSS対策）
  httpOnly: true,
  // 本番環境ではHTTPS通信のみCookie送信 （盗聴対策）
  secure: process.env.NODE_ENV === 'production',
  // 別サイトからの不正リクエストを抑制する （CSRF対策）
  sameSite: 'lax' as const,
}
