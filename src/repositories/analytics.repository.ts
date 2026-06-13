import { prisma } from '@/app/_utils/prisma'

export const analyticsRepository = {
  // TimeLog を Activity → Profile 経由で取得
  async findDayTimelogs(userId: string, fromDay: Date, toDay: Date) {
    const timelogs = await prisma.timeLog.findMany({
      where: {
        activity: { profile: { userId } },
        endAt: { gte: fromDay, lte: toDay },
      },
      include: {
        activity: {
          select: { id: true, name: true, colorToken: true },
        },
      },
      orderBy: { startAt: 'asc' },
    })
    return timelogs
  },
}
