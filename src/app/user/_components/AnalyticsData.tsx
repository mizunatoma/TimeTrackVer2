'use client'
import { formatMinutes } from '@/app/_utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GetAnalyticsResponse, GoalResponse } from '@/types/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import Skelton from './Skelton'

// 重いRechartsを初回バンドルから分離し、この画面を開いた時だけ読み込む（dynamic import）
const AnalyticsCharts = dynamic(() => import('./AnalyticsCharts'), {
  loading: () => <Skelton height="h-[300px]" />,
})

type Props = {
  currentDate: Date
  onNavigate: (direction: number) => void
  dateTo: string
  data: GetAnalyticsResponse
  goalData: GoalResponse
}

export default function AnalyticsData({
  currentDate,
  onNavigate,
  dateTo,
  data,
  goalData,
}: Props) {
  // 当月の日数
  const daysInMonth = Number(dateTo.slice(-2))
  // 記録総時間
  const sumTotalMinutes = data.byCategory.reduce(
    (sum, item) => sum + item.totalMinutes,
    0,
  )
  // 1日平均記録時間
  const avgMinutes = Math.floor(sumTotalMinutes / daysInMonth)
  // 目標達成率
  const goalProgressPercent = goalData.goal?.targetStudyTime
    ? Math.round((sumTotalMinutes / (goalData.goal.targetStudyTime * 60)) * 100)
    : '未設定'

  // 全カテゴリの合計分数をもとに、棒グラフのY軸(h目盛り)の配列を作成
  const yAxisTicks = useMemo(() => {
    const allMinutes = data.byCategory.map((c) => c.totalMinutes)
    const maxMinutes = Math.max(0, ...allMinutes)
    return Array.from(
      { length: Math.ceil(maxMinutes / 60) + 1 },
      (_, i) => i * 60,
    )
  }, [data])

  // グラフ表示用データ
  const chartData = useMemo(() => {
    return data.byCategory
      .filter((c) => c.totalMinutes >= 1) // 0分は非表示
      .sort((a, b) => b.totalMinutes - a.totalMinutes) // 降順
  }, [data])

  return (
    <Card>
      {/* ナビゲーション < YYYY-MM > */}
      <CardHeader>
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => onNavigate(-1)}>
            <ChevronLeft />
          </button>
          <CardTitle>
            {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
          </CardTitle>
          <button onClick={() => onNavigate(1)}>
            <ChevronRight />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {data.byCategory.length === 0 ? (
          <p className="flex justify-center">この月の記録はありません</p>
        ) : (
          <>
            {/* 学習時間統計 */}
            <div className="flex w-full items-center justify-center gap-4">
              <p>総時間 : {formatMinutes(sumTotalMinutes)}</p>
              <p>平均時間 : {formatMinutes(avgMinutes)} / 日</p>
              <p>
                目標達成率 :{' '}
                {typeof goalProgressPercent === 'number'
                  ? goalProgressPercent + '%'
                  : goalProgressPercent}
              </p>
            </div>
            {/* グラフ */}
            <AnalyticsCharts chartData={chartData} yAxisTicks={yAxisTicks} />
          </>
        )}
      </CardContent>
    </Card>
  )
}
