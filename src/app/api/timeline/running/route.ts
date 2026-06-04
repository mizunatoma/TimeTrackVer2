// /api/timeline/running
export const dynamic = 'force-dynamic'
import { getAuthUser } from '@/app/_utils/getAuthUser'
import { prisma } from '@/app/_utils/prisma'
import type { GetRunningTimelogResponse } from '@/types/api'
import { NextResponse } from 'next/server'

// ===============================
// GET
// ===============================
export const GET = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    const runningLog = await prisma.timeLog.findFirst({
      where: {
        endAt: null,
        activity: { profile: { userId: user.id }, deletedAt: null },
      },
      include: { activity: true },
    })
    if (!runningLog) {
      return NextResponse.json<GetRunningTimelogResponse>({ running: false })
    }

    return NextResponse.json<GetRunningTimelogResponse>({
      running: true,
      log: {
        id: runningLog.id,
        activityId: runningLog.activityId,
        activityName: runningLog.activity.name,
        colorToken: runningLog.activity.colorToken,
        startAt: runningLog.startAt.toISOString(),
      },
    })
  } catch (e) {
    console.error('GET /timeline/running error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
