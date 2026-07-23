'use client'
import { toJstParts } from '@/app/_utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GetAnalyticsResponse, GoalResponse } from '@/types/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import AnalyticsData from '../_components/AnalyticsData'
import GoalCard from '../_components/GoalCard'
import Skelton from '../_components/Skelton'
import { useFetch } from '../_hooks/useFetch'

// 重いRechartsを初回バンドルから分離し、この画面を開いた時だけ読み込む（dynamic import）
const AnalyticsCharts = dynamic(
  () => import('../_components/AnalyticsCharts'),
  { loading: () => <Skelton height="h-[300px]" /> },
)

export default function Page() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const dateFrom = toJstParts(currentDate).slice(0, 7) + '-01' // 当月の１日
  const dateTo = toJstParts(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
  ) //dateToの末尾「,0」 => 次の月の0日目 => 今月の最終日

  const { data, error, isLoading } = useFetch<GetAnalyticsResponse>(
    `/api/analytics?from=${dateFrom}&to=${dateTo}`,
  )
  const {
    data: goalData,
    error: goalError,
    isLoading: isGoalLoading,
  } = useFetch<GoalResponse>('/api/goal')

  // 月切替ナビボタン
  const handleNavButton = (direction: number) => {
    // 日付を 1 日に固定 ⇒ 翌月に31日がない場合の、月が飛び越えるバグを防ぐ定石
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + direction,
      1,
    )
    setCurrentDate(nextDate)
  }

  // useMemoで配列の同一性を保持。依存はdataのみ
  // yAxisTicks, chartData ↓

  // 全カテゴリの合計分数をもとに、棒グラフのY軸(h目盛り)の配列を作成
  const yAxisTicks = useMemo(() => {
    const allMinutes = data?.byCategory.map((c) => c.totalMinutes) ?? []
    const maxMinutes = Math.max(0, ...allMinutes)
    return Array.from(
      { length: Math.ceil(maxMinutes / 60) + 1 },
      (_, i) => i * 60,
    )
  }, [data])

  // グラフ表示用データ
  const chartData = useMemo(() => {
    return (
      data?.byCategory
        .filter((c) => c.totalMinutes >= 1) // 0分は非表示
        .sort((a, b) => b.totalMinutes - a.totalMinutes) ?? [] // 降順
    )
  }, [data])

  if (error || goalError) return <p>エラーが発生しました</p>

  return (
    <div className="flex flex-col gap-4 p-4">
      {isLoading || isGoalLoading || !data || !goalData ? (
        // スケルトンスクリーン シマーエフェクト
        <Skelton height="h-[382px]">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skelton height="h-[300px]" />
            <Skelton height="h-[300px]" />
          </div>
        </Skelton>
      ) : data?.byCategory.length === 0 ? (
        <Card className="flex h-[382px] flex-col justify-center gap-4">
          <CardContent>
            <p className="flex justify-center">この月の記録はありません</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 学習目標 */}
          <Card>
            <CardContent>
              <GoalCard goalData={goalData} />
            </CardContent>
          </Card>

          <Card>
            {/* ナビゲーション < YYYY-MM > */}
            <CardHeader>
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => handleNavButton(-1)}>
                  <ChevronLeft />
                </button>
                <CardTitle>
                  {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                </CardTitle>
                <button onClick={() => handleNavButton(1)}>
                  <ChevronRight />
                </button>
              </div>
            </CardHeader>
            {/* 学習統計 */}
            <CardContent>
              <AnalyticsData dateTo={dateTo} data={data} goalData={goalData} />
              <AnalyticsCharts chartData={chartData} yAxisTicks={yAxisTicks} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
