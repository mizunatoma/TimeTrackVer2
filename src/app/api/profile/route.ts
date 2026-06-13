// /api/profile
import { getAuthUser } from '@/app/_utils/getAuthUser'
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
    return NextResponse.json<ProfileResponse>({ profile }, { status: 200 })
  } catch (e) {
    console.error('GET /profile error:', e)
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

    const { displayName } = await request.json()

    const profile = await profileService.upsertDisplayname(user.id, displayName)

    return NextResponse.json<ProfileResponse>({ profile }, { status: 200 })
  } catch (e) {
    console.error('POST /profile error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
