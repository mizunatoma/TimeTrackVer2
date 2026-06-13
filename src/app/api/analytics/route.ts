// /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
export const dynamic = 'force-dynamic'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { analyticsService } from '@/services/analytics.service'
import { GetAnalyticsResponse } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // クエリパラメータから from/to を取得
    // Next.jsが用意しているクエリパラメータ抽出拡張プロパティ
    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    if (!from || !to) {
      return NextResponse.json({ error: 'date is required' }, { status: 400 })
    }

    // 指定した日のログを全取得
    const [fromDay, toDay] = await analyticsService.parseDateRange(from, to)
    const logs = await analyticsService.findDayTimelogs(user.id, fromDay, toDay)

    // カテゴリごとの集計を取得
    const byCategory = await analyticsService.aggregatePerCategory(logs)

    return NextResponse.json<GetAnalyticsResponse>(
      { byCategory },
      { status: 200 },
    )
  } catch (e) {
    console.error('GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
