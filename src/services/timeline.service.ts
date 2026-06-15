import {
  categoryRepository,
  timelineRepository,
} from '@/repositories/timeline.repository'
import type {
  CategoryDTO,
  GetRunningTimelogResponse,
  TimelogDTO,
} from '@/types/api'
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

const toRunningTimelogResponse = (
  log: TimeLogWithActivity,
): GetRunningTimelogResponse => ({
  running: true,
  log: {
    id: log.id,
    activityId: log.activityId,
    activityName: log.activity.name,
    colorToken: log.activity.colorToken,
    startAt: log.startAt.toISOString(),
  },
})

export const timelineService = {
  async findDayTimelogs(userId: string, fromDay: Date, toDay: Date) {
    const logs = await timelineRepository.findDayTimelogs(
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

  async findActivity(activityId: string, userId: string) {
    const activity = await timelineRepository.findActivity(activityId, userId)
    return activity
  },
  async findRunningTimelog(userId: string) {
    const log = await timelineRepository.findRunningTimelog(userId)
    if (!log) return null
    return toRunningTimelogResponse(log)
  },
  async startTimelog(activityId: string) {
    const log = await timelineRepository.createTimeLog(activityId)
    return toTimelogDTO(log)
  },
  async endTimelog(runningLogId: string) {
    const log = await timelineRepository.endTimeLog(runningLogId)
    return toTimelogDTO(log)
  },
}

//-----------------------------------------------------------------
const toCategoryDTO = (
  // Pick<> => 「Activity のうち id, name, colorToken だけ持っていれば受け入れる」型
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
