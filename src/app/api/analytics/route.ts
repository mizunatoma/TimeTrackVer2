// /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { prisma } from '@/app/_utils/prisma'
import type { GetAnalyticsResponse } from '@/types/api'

// ===============================
// GET
// ===============================
export const GET = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // クエリパラメータから from/to を取得
    const searchParams = request.nextUrl.searchParams // Next.jsが用意しているクエリパラメータ抽出の拡張プロパティ
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    if (!from || !to) {
      return NextResponse.json({ error: 'date is required' }, { status: 400 })
    }

    // string → Date型に （+09:00 = JST）
    const fromDay = new Date(`${from}T00:00:00.000+09:00`)
    const toDay = new Date(`${to}T23:59:59.999+09:00`)

    // TimeLog を Activity → Profile 経由で取得
    const logs = await prisma.timeLog.findMany({
      where: {
        activity: { profile: { userId: user.id } },
        endAt: { gte: fromDay, lte: toDay },
      },
      include: {
        activity: {
          select: { id: true, name: true, colorToken: true },
        },
      },
      orderBy: { startAt: 'asc' },
    })

    // 集計ロジック
    const totals: Record<
      string, // = log.activityId
      { name: string; colorToken: string | null; totalMinutes: number }
    > = {}
    // logs をループして activityId ごとに分数を合計する
    for (const log of logs) {
      const minutes = Math.floor(
        (new Date(log.endAt!).getTime() - new Date(log.startAt!).getTime()) /
          60000,
      )
      if (!totals[log.activityId]) {
        // 初回：オブジェクトを作る
        totals[log.activityId] = {
          name: log.activity.name,
          colorToken: log.activity.colorToken,
          totalMinutes: 0, // 初回はまず0で作る
        }
      }
      // 2回目以降
      totals[log.activityId].totalMinutes += minutes
      // totaols = {"abc123": { name: "コーディング", colorToken: "green", totalMinutes: 120 }, "":{},...}
    }
    // Object.entries(オブジェクト名)でリスト化 => [["abc123": { name: "コーディング", colorToken: "green", totalMinutes: 120 }], ["":{}],...]
    const byCategory = Object.entries(totals).map(([id, value]) => ({
      id: id,
      name: value.name,
      colorToken: value.colorToken,
      totalMinutes: value.totalMinutes,
    }))

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
