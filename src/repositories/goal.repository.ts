import { prisma } from '@/app/_utils/prisma'

export const goalRepository = {
  async find(profileId: string) {
    const goal = await prisma.goal.findUnique({
      where: { profileId },
    })
    return goal
  },

  async upsert(
    profileId: string,
    qualificationName: string,
    examDate: string,
    targetStudyTime: number,
  ) {
    const goal = await prisma.goal.upsert({
      where: { profileId },
      update: { qualificationName, examDate, targetStudyTime },
      create: { profileId, qualificationName, examDate, targetStudyTime },
    })
    return goal
  },
}
