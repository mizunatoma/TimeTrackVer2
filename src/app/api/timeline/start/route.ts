// /api/timeline/start
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_utils/prisma'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import type { StartTimelogRequest, StartTimelogResponse } from '@/types/api'

// ===============================
// POST
// ===============================
export const POST = async (request: NextRequest) => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    //endAt が null の timeLog を findFirst で探して、
    //見つかったら runningLog は truthy になる
    const runningLog = await prisma.timeLog.findFirst({
      where: {
        endAt: null,
        activity: { profile: { userId: user.id } },
      },
    })
    if (runningLog) {
      return NextResponse.json({ error: 'Already running' }, { status: 409 })
    }

    // activityId 取得
    const { activityId } = (await request.json()) as StartTimelogRequest
    const activity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        profile: { userId: user.id },
      },
    })
    if (!activity) {
      return NextResponse.json(
        { error: 'Authorization failure' },
        { status: 403 },
      )
    }

    // timeLog 作成
    const timelog = await prisma.timeLog.create({
      data: { activityId, startAt: new Date() },
      include: { activity: true },
    })

    const mapped = {
      id: timelog.id,
      title: timelog.activity.name,
      startAt: timelog.startAt.toISOString(),
      endAt: timelog.endAt ? timelog.endAt.toISOString() : null,
      category: { colorToken: timelog.activity.colorToken },
    }

    return NextResponse.json<StartTimelogResponse>(
      { timelog: mapped },
      { status: 201 },
    )
  } catch (e) {
    console.error('POST /timeline/start error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
