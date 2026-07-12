import { prisma } from '@/app/_utils/prisma'

export class AlreadyRunningError extends Error {} // route層がcatchで instanceof 判定に使う
export class RunningLogNotFoundError extends Error {}

export const timelineRepository = {
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

  async findActivity(activityId: string, userId: string) {
    const activity = await prisma.activity.findFirst({
      where: {
        id: activityId,
        profile: { userId },
      },
    })
    return activity
  },

  async findLogsPaginated(userId: string, skip: number, take: number) {
    // 配列形式transaction
    const [logs, total] = await prisma.$transaction([
      prisma.timeLog.findMany({
        where: {
          activity: { profile: { userId } },
          endAt: { not: null },
        },
        include: {
          activity: {
            select: { id: true, name: true, colorToken: true },
          },
        },
        skip,
        take,
        orderBy: { startAt: 'desc' },
      }),
      prisma.timeLog.count({
        // logの全件数を取得
        where: {
          activity: { profile: { userId } },
          endAt: { not: null },
        },
      }),
    ])
    return { logs, total }
  },

  async findRunningTimelog(userId: string) {
    const runningLog = await prisma.timeLog.findFirst({
      where: {
        endAt: null,
        activity: { profile: { userId }, deletedAt: null },
      },
      include: { activity: true },
    })
    return runningLog
  },

  async startTimeLogAtomic(userId: string, activityId: string) {
    return await prisma.$transaction(
      async (tx) => {
        // ※この中では prisma ではなく tx を使う（prismaだとトランザクションの外で実行される）
        const runningLog = await tx.timeLog.findFirst({
          where: {
            endAt: null,
            activity: { profile: { userId }, deletedAt: null },
          },
        })
        if (runningLog) {
          // throw = ロールバックの合図 + routeに 409 を知らせる通知の二役を担う
          throw new AlreadyRunningError()
        }
        const timeLog = await tx.timeLog.create({
          data: { activityId, startAt: new Date() },
          include: { activity: true },
        })
        return timeLog
      }, // ← 第1引数（コールバック関数）
      { isolationLevel: 'Serializable' },
      // 第2引数: 分離レベル。Serializable = 同時に来た2本を、同時に走らせず競合を完封
    )
  },

  async endTimeLogAtomic(userId: string) {
    return await prisma.$transaction(
      async (tx) => {
        const runningLog = await tx.timeLog.findFirst({
          where: {
            endAt: null,
            activity: { profile: { userId }, deletedAt: null },
          },
        })
        if (!runningLog) {
          throw new RunningLogNotFoundError()
        }
        const timelog = await tx.timeLog.update({
          where: { id: runningLog.id },
          data: { endAt: new Date() },
          include: { activity: true },
        })
        return timelog
      },
      { isolationLevel: 'Serializable' },
    )
  },
}

export const categoryRepository = {
  async findAll(userId: string) {
    const activities = await prisma.activity.findMany({
      where: {
        profile: { userId },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        colorToken: true,
      },
    })
    return activities
  },
  async findOne(categoryId: string, userId: string) {
    const activity = await prisma.activity.findFirst({
      where: {
        id: categoryId,
        profile: { userId },
        deletedAt: null,
      },
    })
    return activity
  },
  async create(userId: string, name: string, colorToken?: string | null) {
    const activity = await prisma.activity.create({
      data: {
        name,
        colorToken,
        profile: { connect: { userId } },
      },
    })
    return activity
  },
  async update(
    categoryId: string,
    name: string | undefined,
    colorToken?: string | null,
  ) {
    const activity = await prisma.activity.update({
      where: { id: categoryId },
      data: {
        ...(name !== undefined && { name }),
        ...(colorToken && { colorToken }),
      },
    })
    return activity
  },
  async delete(categoryId: string) {
    await prisma.activity.update({
      where: { id: categoryId },
      data: { deletedAt: new Date() },
    })
  },
}
