import { goalRepository } from '@/repositories/goal.repository'

export const goalService = {
  async findOne(profileId: string) {
    return await goalRepository.find(profileId)
  },

  async upsert(
    profileId: string,
    qualificationName: string,
    examDate: string,
    targetStudyTime: number,
  ) {
    return await goalRepository.upsert(
      profileId,
      qualificationName,
      examDate,
      targetStudyTime,
    )
  },
}
