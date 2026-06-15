import { prisma } from '@/app/_utils/prisma'

export const analyticsRepository = {
  // TimeLog を Activity → Profile 経由で取得
  async findDayTimeLogs(userId: string, from: Date, to: Date) {
    const timeLogs = await prisma.timeLog.findMany({
      where: {
        activity: { profile: { userId } },
        endAt: { gte: from, lte: to },
      },
      include: {
        activity: {
          select: { id: true, name: true, colorToken: true },
        },
      },
      orderBy: { startAt: 'asc' },
    })
    return timeLogs
  },
}
