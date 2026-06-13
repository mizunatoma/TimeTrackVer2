import { analyticsRepository } from '@/repositories/analytics.repository'

export const analyticsService = {
  async findDayTimelogs(userId: string, fromDay: Date, toDay: Date) {
    return await analyticsRepository.findDayTimelogs(userId, fromDay, toDay)
  },
  // string → Date型に （+09:00 = JST）
  async parseDateRange(from: string, to: string) {
    const fromDay = new Date(`${from}T00:00:00.000+09:00`)
    const toDay = new Date(`${to}T23:59:59.999+09:00`)
    return [fromDay, toDay]
  },
  async aggregatePerCategory(
    // ReturnType<typeof ...> → 「この関数の戻り値の型」
    // Awaited<...> → 「Promiseを解決した後の型」
    // =>「findDayTimelogs が返す配列と同じ型」
    logs: Awaited<ReturnType<typeof analyticsRepository.findDayTimelogs>>,
  ) {
    // 集計ロジック
    const totals: Record<
      string, // = log.activityId
      { name: string; colorToken: string | null; totalMinutes: number }
    > = {}
    // logs をループして activityId ごとに分数を合計する
    for (const log of logs) {
      const minutes = Math.floor(
        (new Date(log.endAt!).getTime() - new Date(log.startAt!).getTime()) /
          60000,
      )
      if (!totals[log.activityId]) {
        // 初回：オブジェクトを作る
        totals[log.activityId] = {
          name: log.activity.name,
          colorToken: log.activity.colorToken,
          totalMinutes: 0, // 初回はまず0で作る
        }
      }
      // 2回目以降
      totals[log.activityId].totalMinutes += minutes
      // totaols = {"abc123": { name: "コーディング", colorToken: "green", totalMinutes: 120 }, "":{},...}
    }
    // Object.entries(オブジェクト名)でリスト化 => [["abc123": { name: "コーディング", colorToken: "green", totalMinutes: 120 }], ["":{}],...]
    const byCategory = Object.entries(totals).map(([id, value]) => ({
      id: id,
      name: value.name,
      colorToken: value.colorToken,
      totalMinutes: value.totalMinutes,
    }))
    return byCategory
  },
}
