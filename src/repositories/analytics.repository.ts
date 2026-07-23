import { prisma } from '@/app/_utils/prisma'

export const analyticsRepository = {
  // TimeLog を Activity → Profile 経由で取得
  async findDayTimeLogs(userIds: string[], from: Date, to: Date) {
    const timeLogs = await prisma.timeLog.findMany({
      where: {
        activity: { profile: { userId: { in: userIds } } }, // IN句: 全ユーザー分を1クエリで取得（N+1回避）
        endAt: { gte: from, lte: to },
      },
      include: {
        activity: {
          select: {
            id: true,
            name: true,
            colorToken: true,
            profile: { select: { userId: true } }, // 仕分け用に取得
          },
        },
      },
      orderBy: { startAt: 'asc' },
    })
    return timeLogs
  },

  async findLogDatesByProfile(profileId: string, from: Date, to: Date) {
    const timeLogs = await prisma.timeLog.findMany({
      where: {
        activity: { profileId },
        endAt: { gte: from, lte: to },
      },
      select: { startAt: true }, // 日付判定だけなので必要最小限のフィールドに絞る
      orderBy: { startAt: 'asc' },
    })
    return timeLogs
  },
}
