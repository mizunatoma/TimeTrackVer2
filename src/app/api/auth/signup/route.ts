import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/app/_utils/prisma'
import { signJWT } from '@/app/_lib/jwt'
import { cookies } from 'next/headers'

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json()

  // bcryptjs でパスワードをハッシュ化
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password, salt)

  // Prisma でDBにユーザーを保存
  const userId = await prisma.user.create({
    data: { passwordHash, email },
  })

  try {
    // signJWT(userId) でJWTを発行
    const jwt = await signJWT(userId.id)
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
