import { prisma } from '@/app/_utils/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try{
  const { email, password } = await request.json()

  // bcryptjs でパスワードをハッシュ化
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(password, salt)

  // Prisma でDBにユーザーを保存
  await prisma.user.create({
    data: { passwordHash, email },
  })

  return NextResponse.json({ message: 'ok' })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 })
  }
}