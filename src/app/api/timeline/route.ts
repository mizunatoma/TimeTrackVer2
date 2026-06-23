// /api/timeline?date=YYYY-MM-DD
export const dynamic = 'force-dynamic'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { periodQuerySchema } from '@/schemas/timeline'
import { timelineService } from '@/services/timeline.service'
import { GetTimelogResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // クエリパラメータから period, page を取得
    const { searchParams } = new URL(request.url) // リクエストのURL文字列を URLオブジェクトに変換
    const period = searchParams.get('period') // day/week/month
    const page = searchParams.get('page') // -? ～ 0
    const result = periodQuerySchema.safeParse({ period, page })
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    // 指定日の開始・終了時刻（JST）
    const [startOfDay, endOfDay] = await timelineService.parsePeriodRange(
      result.data.period,
      result.data.page,
    )

    // TimeLog を Activity → Profile 経由で取得
    const logs = await timelineService.findDayTimelogs(
      user.id,
      startOfDay,
      endOfDay,
    )

    return NextResponse.json<GetTimelogResponse>(
      { activities: logs },
      { status: 200 },
    )
  } catch (e) {
    logger.error('GET /timeline?date=YYYY-MM-DD', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
