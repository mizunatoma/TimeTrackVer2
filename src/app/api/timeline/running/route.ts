// /api/timeline/running
export const dynamic = 'force-dynamic'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { timelineService } from '@/services/timeline.service'
import type { GetRunningTimelogResponse } from '@/types/api'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const runningLog = await timelineService.findRunningTimelog(user.id)
    if (!runningLog) {
      return NextResponse.json<GetRunningTimelogResponse>({ running: false })
    }

    return NextResponse.json<GetRunningTimelogResponse>(runningLog)
  } catch (e) {
    console.error('GET /timeline/running error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
