import { analyticsRepository } from '@/repositories/analytics.repository'
import { categoryRepository } from '@/repositories/timeline.repository'
import type { CategoryDTO, TimelogDTO } from '@/types/api'
import { Activity, Prisma } from '@prisma/client'

type TimeLogWithActivity = Prisma.TimeLogGetPayload<{
  include: { activity: { select: { name: true; colorToken: true } } }
}>

const toTimelogDTO = (log: TimeLogWithActivity): TimelogDTO => ({
  id: log.id,
  title: log.activity.name,
  startAt: log.startAt.toISOString(),
  endAt: log.endAt ? log.endAt.toISOString() : null,
  category: { colorToken: log.activity.colorToken },
})

export const timelineService = {
  async findDayTimelogs(userId: string, fromDay: Date, toDay: Date) {
    const logs = await analyticsRepository.findDayTimelogs(
      userId,
      fromDay,
      toDay,
    )
    return logs.map(toTimelogDTO)
  },

  // string → Date型に （+09:00 = JST）
  async parseDateRange(from: string, to: string) {
    const fromDay = new Date(`${from}T00:00:00.000+09:00`)
    const toDay = new Date(`${to}T23:59:59.999+09:00`)
    return [fromDay, toDay]
  },
}

//-----------------------------------------------------------------
const toCategoryDTO = (
  // 「Activity のうち id, name, colorToken だけ持っていれば受け入れる」型
  category: Pick<Activity, 'id' | 'name' | 'colorToken'>,
): CategoryDTO => ({
  id: category.id,
  name: category.name,
  colorToken: category.colorToken,
})

export const categoryService = {
  async findCategories(userId: string) {
    const categories = await categoryRepository.findAll(userId)
    return categories.map(toCategoryDTO)
  },
  async findCategory(categoryId: string, userId: string) {
    const category = await categoryRepository.findOne(categoryId, userId)
    if (!category) return null
    return toCategoryDTO(category)
  },
  async createCategory(
    userId: string,
    name: string,
    colorToken: string | null,
  ) {
    const category = await categoryRepository.create(userId, name, colorToken)
    return toCategoryDTO(category)
  },
  async updateCategories(
    categoryId: string,
    name: string | undefined,
    colorToken: string | null,
  ) {
    const category = await categoryRepository.update(
      categoryId,
      name,
      colorToken,
    )
    return toCategoryDTO(category)
  },
  async deleteCategories(categoryId: string) {
    await categoryRepository.delete(categoryId)
  },
}
