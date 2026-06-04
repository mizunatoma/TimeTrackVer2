// /api/profile
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { prisma } from '@/app/_utils/prisma'
import type { ProfileResponse, UpdateProfileRequest } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

// ===============================
// GET
// ===============================
export const GET = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        displayName: true,
      },
    })
    if (!profile)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json<ProfileResponse>({ profile }, { status: 200 })
  } catch (e) {
    console.error('GET /profile error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// ===============================
// PUT
// ===============================
export const PUT = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const body = (await request.json()) as UpdateProfileRequest
    const { displayName } = body

    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: { displayName },
      select: {
        id: true,
        displayName: true,
      },
    })

    return NextResponse.json<ProfileResponse>({ profile }, { status: 200 })
  } catch (e) {
    console.error('PUT /profile error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// ===============================
// POST
// ===============================
export const POST = async () => {
  const auth = await getAuthUser()
  if (auth instanceof NextResponse) return auth
  const user = auth.user

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
      select: {
        id: true,
        displayName: true,
      },
    })

    return NextResponse.json<ProfileResponse>({ profile }, { status: 200 })
  } catch (e) {
    console.error('POST /profile error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
