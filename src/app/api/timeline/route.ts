// /api/timeline?date=YYYY-MM-DD
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/prisma'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import type { GetTimelogResponse } from '@/types/api'

// ===============================
// GET
// ===============================
export const GET = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // クエリパラメータから date を取得
    const { searchParams } = new URL(request.url) // リクエストのURL文字列を URLオブジェクトに変換
    const date = searchParams.get('date') // "2026-01-01" or null
    if (!date) {
      return NextResponse.json({ error: 'date is required' }, { status: 400 })
    }

    // 指定日の開始・終了時刻（JST）
    const startOfDay = new Date(`${date}T00:00:00.000+09:00`) //
    const endOfDay = new Date(`${date}T23:59:59.999+09:00`) //

    // TimeLog を Activity → Profile 経由で取得
    const logs = await prisma.timeLog.findMany({
      where: {
        activity: { profile: { userId: user.id } },
        OR: [
          { startAt: { gte: startOfDay, lte: endOfDay } },
          { endAt: { gte: startOfDay, lte: endOfDay } },
          { endAt: null }, // 実行中ログ
        ],
      },
      include: {
        activity: {
          select: { id: true, name: true, colorToken: true },
        },
      },
      orderBy: { startAt: 'asc' },
    })

    const activities = logs.map((log) => ({
      id: log.id,
      title: log.activity.name,
      startAt: log.startAt.toISOString(),
      endAt: log.endAt ? log.endAt.toISOString() : null,
      category: { colorToken: log.activity.colorToken },
    }))

    return NextResponse.json<GetTimelogResponse>(
      { activities },
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
