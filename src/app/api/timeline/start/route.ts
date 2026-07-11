// /api/timeline/start
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { AlreadyRunningError } from '@/repositories/timeline.repository'
import { startTimelogSchema } from '@/schemas/timeline'
import { timelineService } from '@/services/timeline.service'
import type { StartTimelogResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const body = await request.json()
    const result = startTimelogSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    // 指定されたactivityがユーザのものか確認する
    const activity = await timelineService.findActivity(
      result.data.activityId,
      user.id,
    )

    if (!activity) {
      return NextResponse.json(
        { error: 'Authorization failure' },
        { status: 403 },
      )
    }

    // timeLogを開始する
    const timelog = await timelineService.startTimelog(
      user.id,
      result.data.activityId,
    )

    return NextResponse.json<StartTimelogResponse>({ timelog }, { status: 201 })
  } catch (e) {
    if (e instanceof AlreadyRunningError) {
      return NextResponse.json({ error: 'Already running' }, { status: 409 })
    } else {
      logger.error('POST /timeline/start error', {
        error: e instanceof Error ? e.stack : String(e),
      })
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      )
    }
  }
}
