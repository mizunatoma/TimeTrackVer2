import { goalRepository } from '@/repositories/goal.repository'
import { GoalDTO } from '@/types/api'
import type { Goal } from '@prisma/client'

const toGoalDTO = (goal: Goal): GoalDTO => ({
  id: goal.id,
  qualificationName: goal.qualificationName,
  examDate: goal.examDate.toISOString(),
  targetStudyTime: goal.targetStudyTime,
  createdAt: goal.createdAt.toISOString(),
  updatedAt: goal.updatedAt.toISOString(),
})

export const goalService = {
  async findOne(profileId: string) {
    const goal = await goalRepository.find(profileId)
    if (!goal) return null
    return toGoalDTO(goal)
  },

  async upsert(
    profileId: string,
    qualificationName: string,
    examDate: string,
    targetStudyTime: number,
  ) {
    const goal = await goalRepository.upsert(
      profileId,
      qualificationName,
      new Date(examDate),
      targetStudyTime,
    )
    if (!goal) return null
    return toGoalDTO(goal)
  },
}
