// /api/timeline/end
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { prisma } from '@/app/_utils/prisma'
import type { EndTimelogResponse } from '@/types/api'
import { NextResponse } from 'next/server'

// ===============================
// POST
// ===============================
export const POST = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    // 進行中のアクティビティを探す
    const runningLog = await prisma.timeLog.findFirst({
      where: {
        endAt: null,
        activity: { profile: { userId: user.id } },
      },
    })
    if (!runningLog) {
      return NextResponse.json(
        { error: 'runningLog not found' },
        { status: 400 },
      )
    }

    // 見つかった timelog の id を使って終了時間を更新
    const timelog = await prisma.timeLog.update({
      where: { id: runningLog.id },
      data: { endAt: new Date() },
      include: { activity: true },
    })

    const mapped = {
      id: timelog.id,
      title: timelog.activity.name,
      startAt: timelog.startAt.toISOString(),
      endAt: timelog.endAt ? timelog.endAt.toISOString() : null,
      category: { colorToken: timelog.activity.colorToken },
    }

    return NextResponse.json<EndTimelogResponse>(
      { timelog: mapped },
      { status: 200 },
    )
  } catch (e) {
    console.error('POST /timeline/end error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
