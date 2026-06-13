import { profileRepository } from '@/repositories/profile.repository'

export const profileService = {
  async findOne(userId: string) {
    return await profileRepository.find(userId)
  },
  async upsertDisplayname(userId: string, displayName: string) {
    return await profileRepository.upsert(userId, displayName)
  },
}
