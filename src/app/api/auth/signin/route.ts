import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/app/_utils/prisma'
import { cookies } from 'next/headers'
import { signJWT } from '@/app/_lib/jwt'

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json()

  // 2. email でDBからユーザーを検索する
  const userId = await prisma.user.findUnique({
    where: { email },
  })
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // 3. bcrypt.compareSync(password, DBのハッシュ) で照合
  const res = bcrypt.compareSync(password, userId!.passwordHash)

  // 4. 一致したら signJWT でJWT発行
  if (res) {
    try {
      const jwt = await signJWT(userId!.id)
      // 5. Cookieにセットして返す
      // パスワードの確認
      const cookieStore = await cookies()
      cookieStore.set('jwt', jwt, {
        // JSで読めなくなる （XSS対策）
        httpOnly: true,
        // 本番環境ではHTTPS通信のみCookie送信 （盗聴対策）
        secure: process.env.NODE_ENV === 'production',
        // 別サイトからの不正リクエストを抑制する （CSRF対策）
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 有効期限（秒）
        path: '/',
      })
      return NextResponse.json({ message: 'ok' })
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 400 })
    }
  }

  return NextResponse.json({ message: 'error' }, { status: 400 })
}
