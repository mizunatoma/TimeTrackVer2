'use client'
import { formatMinutes, toJstParts } from '@/app/_utils/format'
import { useFetch } from '@/app/user/_hooks/useFetch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GetAnalyticsResponse } from '@/types/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import Skelton from '../_components/Skelton'

// 重いRechartsを初回バンドルから分離し、この画面を開いた時だけ読み込む（dynamic import）
const AnalyticsCharts = dynamic(
  () => import('../_components/AnalyticsCharts'),
  { loading: () => <Skelton height="h-[600px]" /> },
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

  // 全カテゴリの合計分数をもとに、棒グラフのY軸(h目盛り)の配列を作成
  const allMinutes = data?.byCategory.map((c) => c.totalMinutes) ?? []
  const maxMinutes = Math.max(0, ...allMinutes)
  const yAxisTicks = Array.from(
    { length: Math.ceil(maxMinutes / 60) + 1 },
    (_, i) => i * 60,
  )

  // グラフ表示用データ
  const chartData =
    data?.byCategory
      .filter((c) => c.totalMinutes >= 1) // 0分は非表示
      .sort((a, b) => b.totalMinutes - a.totalMinutes) ?? [] // 降順

  const daysInMonth = Number(dateTo.slice(-2)) // 当月の日数
  const sumTotalMinutes =
    data?.byCategory.reduce((sum, item) => sum + item.totalMinutes, 0) ?? 0 // 記録総時間
  const avgMinutes = Math.floor(sumTotalMinutes / daysInMonth) // 1日平均記録時間

  if (error) return <p>エラーが発生しました</p>

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* ナビゲーション < YYYY-MM > */}
      <Card>
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
      </Card>

      {isLoading ? (
        // スケルトンスクリーン シマーエフェクト
        <Skelton height="">
          <Skelton height="h-[350px]" />
          <Skelton height="h-[350px]" />
        </Skelton>
      ) : data?.byCategory.length === 0 ? (
        <Card className="flex h-[764px] flex-col justify-center gap-4">
          <CardContent>
            <p className="flex justify-center">この月の記録はありません</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <div className="flex w-full items-center justify-center gap-4">
              <p>総時間 : {formatMinutes(sumTotalMinutes)}</p>
              <p>平均時間 : {formatMinutes(avgMinutes)} / 日</p>
            </div>
            <AnalyticsCharts chartData={chartData} yAxisTicks={yAxisTicks} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
