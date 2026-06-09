import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/app/_utils/prisma'
import { JWT_COOKIE_OPTIONS, signJWT } from '@/app/_lib/jwt'
import { cookies } from 'next/headers'

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json()

  // bcryptjs でパスワードをハッシュ化
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password, salt)

  // Prisma でDBにユーザーを保存
  const user = await prisma.user.create({
    data: { passwordHash, email },
  })

  try {
    // signJWT(userId) でJWTを発行
    const jwt = await signJWT(user.id)
    // Cookieにセットして返す
    const cookieStore = await cookies()
    cookieStore.set('jwt', jwt, { ...JWT_COOKIE_OPTIONS })
    return NextResponse.json({ message: 'ok' })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 })
  }
}
