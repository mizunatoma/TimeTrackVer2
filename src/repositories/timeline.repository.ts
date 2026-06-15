import { prisma } from '@/app/_utils/prisma'

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
  async create(userId: string, name: string, colorToken: string | null) {
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
    colorToken: string | null,
  ) {
    const activity = await prisma.activity.update({
      where: { id: categoryId },
      data: {
        ...(name !== undefined && { name }),
        ...(colorToken !== undefined && { colorToken }),
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
