// /api/timeline?date=YYYY-MM-DD
export const dynamic = 'force-dynamic'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { dateQuerySchema } from '@/schemas/timeline'
import { timelineService } from '@/services/timeline.service'
import { GetTimelogResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // クエリパラメータから date を取得
    const { searchParams } = new URL(request.url) // リクエストのURL文字列を URLオブジェクトに変換
    const date = searchParams.get('date') // "2026-01-01" or null
    const result = dateQuerySchema.safeParse({ date })
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    // 指定日の開始・終了時刻（JST）
    const [startOfDay, endOfDay] = await timelineService.parseDateRange(
      result.data.date,
      result.data.date,
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
    console.error('GET /timeline?date=YYYY-MM-DD:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
