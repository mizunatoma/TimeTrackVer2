// /api/guest
import { JWT_COOKIE_OPTIONS, signJWT } from '@/app/_lib/jwt'
import { prisma } from '@/app/_utils/prisma'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const POST = async () => {
  const guestUser = await prisma.user.findUnique({
    where: { email: process.env.GUEST_EMAIL! },
  })
  if (!guestUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const jwt = await signJWT(guestUser!.id)
    const cookieStore = await cookies()
    cookieStore.set('jwt', jwt, { ...JWT_COOKIE_OPTIONS })
    return NextResponse.json({ message: 'ok' })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 })
  }
}
