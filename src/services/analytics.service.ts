import { analyticsRepository } from '@/repositories/analytics.repository'

type DayTimeLogs = Awaited<
  ReturnType<typeof analyticsRepository.findDayTimeLogs>
>
// ① typeof analyticsRepository.findDayTimeLogs
// 「この関数そのものの型」を取り出す
// ② ReturnType<...>
// 関数の型から「戻り値の部分だけ」を抜き出す。
// ③ Awaited<...>
// Promise<中身>から「中身だけ」を取り出す（awaitの型版）。

// 集計: logsをカテゴリ別合計に変換（analytics画面とLINE通知で共用）
function aggregatesByCategory(logs: DayTimeLogs) {
  // 集計ロジック
  const totalsByCategory: Record<
    string, // = log.activityId
    { name: string; colorToken: string | null; totalMinutes: number }
  > = {}

  // logs をループして activityId ごとに分数を合計する
  for (const log of logs) {
    const minutes = Math.floor(
      (new Date(log.endAt!).getTime() - new Date(log.startAt!).getTime()) /
        60000,
    )
    if (!totalsByCategory[log.activityId]) {
      // 初回：オブジェクトを作る
      totalsByCategory[log.activityId] = {
        name: log.activity.name,
        colorToken: log.activity.colorToken,
        totalMinutes: 0, // 初回はまず0で作る
      }
    }
    // 2回目以降
    totalsByCategory[log.activityId].totalMinutes += minutes
    // totalsByCategory = {"abc123": { name: "コーディング", colorToken: "green", totalMinutes: 120 }, "":{},...}
  }
  // Object.entries(オブジェクト名)でリスト化 => [["abc123": { name: "コーディング", colorToken: "green", totalMinutes: 120 }], ["":{}],...]
  const byCategory = Object.entries(totalsByCategory).map(([id, value]) => ({
    id: id,
    name: value.name,
    colorToken: value.colorToken,
    totalMinutes: value.totalMinutes,
  }))

  return byCategory
}

export const analyticsService = {
  // analytics画面用
  async getAnalytics(userId: string, from: string, to: string) {
    const byUser = await this.getAnalyticsByUsers([userId], from, to)
    return byUser[userId] ?? []
  },

  // LINE通知用: 全ユーザー分を1クエリで取り、userIdごとに仕分けてから集計する
  async getAnalyticsByUsers(userIds: string[], from: string, to: string) {
    // string → Date型に （+09:00 = JST）
    const fromDay = new Date(`${from}T00:00:00.000+09:00`)
    const toDay = new Date(`${to}T23:59:59.999+09:00`)

    const logs = await analyticsRepository.findDayTimeLogs(
      userIds,
      fromDay,
      toDay,
    )

    // 仕分け: userId → その人のlogs（集計前に分ける!）
    const logsByUser: Record<string, DayTimeLogs> = {}

    for (const log of logs) {
      const userId = log.activity.profile?.userId // ?. = 無ければundefined
      if (!userId) continue // 持ち主不明のlogはスキップ

      if (!logsByUser[userId]) {
        logsByUser[userId] = [] // // 初回なら空配列を作る
      }
      logsByUser[userId].push(log) // userId ごとの配列に log を振り分ける
    }

    // ユーザごとにlogを集計 (メモリ内ループ・DBには届かない)
    const byUser: Record<string, ReturnType<typeof aggregatesByCategory>> = {}
    for (const [userId, userLogs] of Object.entries(logsByUser)) {
      byUser[userId] = aggregatesByCategory(userLogs)
    }
    return byUser
  },
}
