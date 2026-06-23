// /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
export const dynamic = 'force-dynamic'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { dateRangeQuerySchema } from '@/schemas/timeline'
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
    const result = dateRangeQuerySchema.safeParse({ from, to })
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    // カテゴリごとの集計を取得
    const aggregatePerCategory = await analyticsService.getAnalytics(
      user.id,
      result.data.from,
      result.data.to,
    )

    return NextResponse.json<GetAnalyticsResponse>(
      { byCategory: aggregatePerCategory },
      { status: 200 },
    )
  } catch (e) {
    logger.error('GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
