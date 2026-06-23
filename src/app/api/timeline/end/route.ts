// /api/timeline/end
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { timelineService } from '@/services/timeline.service'
import type { EndTimelogResponse } from '@/types/api'
import { NextResponse } from 'next/server'

export const POST = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // 進行中のアクティビティを探す
    const runningLog = await timelineService.findRunningTimelog(user.id)
    if (runningLog === null || !runningLog.running) {
      return NextResponse.json(
        { error: 'runningLog not found' },
        { status: 400 },
      )
    }

    // 見つかった timelog の id を使って終了時間を更新
    const timelog = await timelineService.endTimelog(runningLog.log.id)

    return NextResponse.json<EndTimelogResponse>({ timelog }, { status: 200 })
  } catch (e) {
    logger.error('POST /timeline/end error', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
