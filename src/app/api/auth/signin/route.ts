import { JWT_COOKIE_OPTIONS, signJWT } from '@/app/_lib/jwt'
import { prisma } from '@/app/_utils/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json()

  // 1. email でユーザーを検索
  const user = await prisma.user.findUnique({
    where: { email },
  })
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // 2. パスワードを照合
  const isMatch = bcrypt.compareSync(password, user.passwordHash)

  // 3. 一致したらセッション（トークン）を発行
  if (isMatch) {
    try {
      const jwt = await signJWT(user.id)
      // 4. Cookie / LocalStorage に保存
      const cookieStore = await cookies()
      cookieStore.set('jwt', jwt, { ...JWT_COOKIE_OPTIONS })
      return NextResponse.json({ message: 'ok' })
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 400 })
    }
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}
