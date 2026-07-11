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
  async startTimelog(userId: string, activityId: string) {
    const log = await timelineRepository.startTimeLogAtomic(userId, activityId)
    return toTimelogDTO(log)
  },
  async endTimelog(userId: string) {
    const log = await timelineRepository.endTimeLogAtomic(userId)
    return toTimelogDTO(log)
  },
  async parsePeriodRange(period: 'day' | 'week' | 'month', page: number) {
    const today = new Date()
    const toDateStr = (d: Date): string => {
      const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
      return jst.toISOString().split('T')[0]
    }
    let from: Date
    let to: Date

    if (period === 'day') {
      from = new Date(today)
      from.setDate(today.getDate() + page) // page=-1 → 昨日
      to = new Date(from) // 1日分なので同じ日
    } else if (period === 'week') {
      const dayOfWeek = today.getDay() // 0=日, 1=月, 2=火..
      const mondayOffset = (dayOfWeek + 6) % 7 // 何日戻ると当週の月曜日か
      from = new Date(today)
      from.setDate(today.getDate() - mondayOffset + page * 7)
      to = new Date(from)
      to.setDate(from.getDate() + 6) // 月曜+6 = 日曜
    } else {
      from = new Date(
        today.getFullYear(),
        today.getMonth() + page, // page=-1 → 先月, page=-2 → 先々月..
        1, // 1日に固定
      )
      to = new Date(
        today.getFullYear(),
        today.getMonth() + page + 1, // 翌月
        0, // 翌月0日目 = 前月末日
      )
    }

    return this.parseDateRange(toDateStr(from), toDateStr(to)) // 既存メソッドで JST変換
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
    colorToken?: string | null,
  ) {
    const category = await categoryRepository.create(userId, name, colorToken)
    return toCategoryDTO(category)
  },

  async updateCategories(
    categoryId: string,
    name: string | undefined,
    colorToken?: string | null,
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
