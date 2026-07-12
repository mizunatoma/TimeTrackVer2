// /api/timeline/logs
export const dynamic = 'force-dynamic'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { paginationQuerySchema } from '@/schemas/timeline'
import { timelineService } from '@/services/timeline.service'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // クエリパラメータから page, limit を取得
    const { searchParams } = new URL(request.url) // リクエストのURL文字列を URLオブジェクトに変換
    const page = searchParams.get('page') ?? undefined // 何ページ目か
    const limit = searchParams.get('limit') ?? undefined // 1ページ何件か
    const result = paginationQuerySchema.safeParse({ page, limit })
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    // TimeLog を Activity → Profile 経由で取得
    const { logs, total } = await timelineService.findLogsPaginated(
      user.id,
      result.data.page,
      result.data.limit,
    )

    return NextResponse.json(
      {
        logs, // 今ページの行データ
        total, // 全件数（フロントがtotalPagesを計算する材料）
        page: result.data.page, // デフォルト値が確定した後の値
        limit: result.data.limit,
      },
      { status: 200 },
    )
  } catch (e) {
    logger.error('GET /timeline/logs', {
      error: e instanceof Error ? e.stack : String(e),
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
