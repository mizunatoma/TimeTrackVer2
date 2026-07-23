'use client'
import { formatMinutes } from '@/app/_utils/format'
import { Card, CardContent } from '@/components/ui/card'
import { GetAnalyticsResponse, GoalResponse } from '@/types/api'

type Props = {
  dateTo: string
  data: GetAnalyticsResponse
  goalData: GoalResponse
}

export default function AnalyticsData({ dateTo, data, goalData }: Props) {
  // 当月の日数
  const daysInMonth = Number(dateTo.slice(-2))
  // 記録総時間
  const sumTotalMinutes =
    data?.byCategory.reduce((sum, item) => sum + item.totalMinutes, 0) ?? 0
  // 1日平均記録時間
  const avgMinutes = Math.floor(sumTotalMinutes / daysInMonth)
  // 目標達成率
  const goalProgressPercent = goalData?.goal?.targetStudyTime
    ? Math.round((sumTotalMinutes / (goalData.goal.targetStudyTime * 60)) * 100)
    : '未設定'

  return (
    <div className="flex">
      <Card>
        <CardContent>
          <p>総時間 : {formatMinutes(sumTotalMinutes)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p>平均時間 : {formatMinutes(avgMinutes)} / 日</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p>
            目標達成率 :{' '}
            {typeof goalProgressPercent === 'number'
              ? goalProgressPercent + '%'
              : goalProgressPercent}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
