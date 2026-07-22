// /api/goal
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { goalSchema } from '@/schemas/goal'
import { goalService } from '@/services/goal.service'
import { profileService } from '@/services/profile.service'
import type { GoalResponse } from '@/types/api'
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

    const goal = await goalService.findOne(profile.id)
    const restDays = await goalService.calculateRemainingDays(profile.id)
    const streak = await goalService.getStreak(profile.id)

    return NextResponse.json<GoalResponse>(
      { goal, restDays, streak },
      { status: 200 },
    )
  } catch (e) {
    logger.error('GET /goal error', {
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
    const result = goalSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    const profile = await profileService.findOne(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'Not found' }, { status: 401 })
    }

    const goal = await goalService.upsert(
      profile.id,
      result.data.qualificationName,
      result.data.examDate,
      result.data.targetStudyTime,
    )

    return NextResponse.json<GoalResponse>({ goal }, { status: 200 })
  } catch (e) {
    logger.error('POST /goal error', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
