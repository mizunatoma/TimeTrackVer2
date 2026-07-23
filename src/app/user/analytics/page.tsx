'use client'
import { toJstParts } from '@/app/_utils/format'
import { Card, CardContent } from '@/components/ui/card'
import { GetAnalyticsResponse, GoalResponse } from '@/types/api'
import { useState } from 'react'
import AnalyticsData from '../_components/AnalyticsData'
import GoalCard from '../_components/GoalCard'
import Skelton from '../_components/Skelton'
import { useFetch } from '../_hooks/useFetch'

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
      ) : (
        <>
          {/* 学習目標 */}
          <Card>
            <CardContent>
              <GoalCard goalData={goalData} />
            </CardContent>
          </Card>

          {/* 月次アナリティクス */}
          <AnalyticsData
            currentDate={currentDate}
            onNavigate={handleNavButton}
            dateTo={dateTo}
            data={data}
            goalData={goalData}
          />
        </>
      )}
    </div>
  )
}