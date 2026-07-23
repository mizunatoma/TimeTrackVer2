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
          <button
            onClick={() => onNavigate(-1)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ChevronLeft size={18} />
          </button>
          <CardTitle className="text-base font-bold text-gray-800">
            {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
          </CardTitle>
          <button
            onClick={() => onNavigate(1)}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {data.byCategory.length === 0 ? (
          <p className="flex justify-center py-8 text-sm text-gray-400">
            この月の記録はありません
          </p>
        ) : (
          <>
            {/* 学習時間統計 */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">合計学習時間</p>
                <p className="mt-1 text-xl font-medium text-gray-900">
                  {formatMinutes(sumTotalMinutes)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">1日平均</p>
                <p className="mt-1 text-xl font-medium text-gray-900">
                  {formatMinutes(avgMinutes)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">目標達成率</p>
                <p className="mt-1 text-xl font-medium text-gray-900">
                  {typeof goalProgressPercent === 'number'
                    ? goalProgressPercent + '%'
                    : goalProgressPercent}
                </p>
              </div>
            </div>

            {/* グラフ */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-gray-800">
                  カテゴリ別学習時間
                </p>
              </div>
              <AnalyticsCharts chartData={chartData} yAxisTicks={yAxisTicks} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
