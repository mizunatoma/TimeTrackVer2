// /api/timeline/end
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { RunningLogNotFoundError } from '@/repositories/timeline.repository'
import { timelineService } from '@/services/timeline.service'
import type { EndTimelogResponse } from '@/types/api'
import { NextResponse } from 'next/server'

export const POST = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // 進行中の log を探して終了時間をセット
    const timelog = await timelineService.endTimelog(user.id)

    return NextResponse.json<EndTimelogResponse>({ timelog }, { status: 200 })
  } catch (e) {
    if (e instanceof RunningLogNotFoundError) {
      return NextResponse.json(
        { error: 'runningLog not found' },
        { status: 409 },
      )
    } else {
      logger.error('POST /timeline/end error', {
        error: e instanceof Error ? e.stack : String(e),
      })
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      )
    }
  }
}
