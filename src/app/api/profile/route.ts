// /api/profile
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { profileSchema } from '@/schemas/profile'
import { profileService } from '@/services/profile.service'
import type { ProfileResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const profile = await profileService.findOne(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Not found' }, { status: 401 })
    }
    return NextResponse.json<ProfileResponse>(
      { profile, isGuest: auth.isGuest },
      { status: 200 },
    )
  } catch (e) {
    logger.error('GET /profile error', {
      error: e instanceof Error ? e.stack : String(e),
    })

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const body = await request.json()
    const result = profileSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    const profile = await profileService.upsertDisplayname(
      user.id,
      result.data.displayName,
    )

    return NextResponse.json<ProfileResponse>(
      { profile, isGuest: auth.isGuest },
      { status: 200 },
    )
  } catch (e) {
    logger.error('POST /profile error', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
