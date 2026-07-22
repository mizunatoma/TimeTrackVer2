import { analyticsRepository } from '@/repositories/analytics.repository'
import { goalRepository } from '@/repositories/goal.repository'
import { GoalDTO } from '@/types/api'
import type { Goal } from '@prisma/client'

const MS_PER_DAY = 24 * 60 * 60 * 1000 // 24h のミリ秒
const HISTORY_DAYS = 100 // ストリーク集計で遡る日数

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

  // 試験日までのカウントダウン日数を取得する
  async calculateRemainingDays(profileId: string) {
    const goal = await goalRepository.find(profileId)
    if (!goal) return null

    const todayJST = new Date(Date.now() + 9 * 60 * 60 * 1000)
      // new Date(1784716620000) → 2026-07-22T10:37:00.000Z（Dateオブジェクト）
      .toISOString() // → "2026-07-22T10:37:00.000Z"
      .split('T')[0] // → "2026-07-22"
    const today = new Date(`${todayJST}T00:00:00+09:00`)
    // `${todayJST}T00:00:00+09:00` → "2026-07-22T00:00:00+09:00"
    // Dateオブジェクト。JST0時と同じ瞬間をUTCで表すとこうなる

    const diffMs = goal.examDate.getTime() - today.getTime() // 1787529600000 -1784646000000 = 2883600000
    // Date型同士は直接引き算できないので、getTime()でミリ秒(number)に変換してから引き算する

    return Math.ceil(diffMs / MS_PER_DAY) // 2883600000 / 86400000 = 33.375  → 残り34日
    // 差分ミリ秒 ÷ 24hのミリ秒 = 小数の日数 → Math.ceilで繰り上げ
  },

  // 連続学習日数(連続log記録)を取得する
  async getStreak(profileId: string) {
    const todayJST = new Date(Date.now() + 9 * 60 * 60 * 1000)
      .toISOString() // → "2026-07-22T10:37:00.000Z"
      .split('T')[0] // → "2026-07-22"
    const today = new Date(`${todayJST}T00:00:00+09:00`)

    const from = new Date(today.getTime() - HISTORY_DAYS * MS_PER_DAY) // 100日前から
    const to = today // today未満 = 今日を含まない
    const timeLogs = await analyticsRepository.findLogDatesByProfile(
      profileId,
      from,
      to,
    )
    const dateStrings = timeLogs.map((log) => {
      const jstShifted = new Date(log.startAt.getTime() + 9 * 60 * 60 * 1000)
      // log.startAt              → Date型
      // log.startAt.getTime()    → number型（ミリ秒）
      // new Date(...)            → Date型
      return jstShifted.toISOString().split('T')[0] // Date型 → string型 "2026-07-22"
    })
    // 複数日付の重複を排除
    const uniqueDates = new Set(dateStrings)

    let streak = 0
    let cursor = new Date(todayJST) // "2026-07-22" を日付のみの文字列としてDate化(UTC 0時扱い)

    while (true) {
      cursor = new Date(cursor.getTime() - MS_PER_DAY) // 1日前へ (過去100日間のみ確認)
      const cursorStr = cursor.toISOString().split('T')[0]

      if (uniqueDates.has(cursorStr)) {
        streak++
      } else {
        break
      }
    }

    return streak
  },
}
