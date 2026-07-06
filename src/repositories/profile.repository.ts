import { prisma } from '@/app/_utils/prisma'

export const profileRepository = {
  async find(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        displayName: true,
      },
    })
    return profile
  },
  async upsert(userId: string, displayName: string) {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { displayName },
      create: { userId, displayName },
      select: {
        id: true,
        displayName: true,
      },
    })
    return profile
  },
  async updateLineUserId(id: string, lineUserId: string) {
    const profile = await prisma.profile.update({
      where: { id },
      data: { lineUserId },
      select: {
        id: true,
        displayName: true,
      },
    })
    return profile
  },
}
