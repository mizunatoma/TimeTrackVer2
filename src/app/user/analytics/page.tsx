'use client'
import { useFetch } from '@/app/user/_hooks/useFetch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GetAnalyticsResponse } from '@/types/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { PieLabelRenderProps } from 'recharts'
import {
  Bar,
  BarChart, // ホバー時に詳細を表示
  CartesianGrid, // 方眼紙のような目盛を表示
  Cell, // 各バーに個別のスタイルを当てるためのコンポーネント
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip, // 親要素に合わせて自動リサイズするラッパー
  XAxis,
  YAxis,
} from 'recharts'
import Skelton from '../_components/Skelton'

// 日本時刻のYYYY-MM-DDを返す
const toJstParts = (date: Date) => {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

// 分数を 〇h 〇m に変換する
const formatMinutes = (totalMinutes: number) => {
  const hour = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return mins !== 0 ? `${hour}h ${mins}m` : `${hour}h`
}

// colorTokenの Tailwind クラス名 → HEX 変換テーブル
const COLOR_MAP: Record<string, string> = {
  'bg-rose-400/60': '#fb7185',
  'bg-teal-400/60': '#2dd4bf',
  'bg-indigo-400/60': '#818cf8',
  'bg-amber-400/60': '#fbbf24',
  'bg-sky-400/60': '#38bdf8',
  'bg-green-400/60': '#4ade80',
  'bg-purple-400/60': '#c084fc',
  'bg-pink-400/60': '#f472b6',
}

// 円グラフの各スライス内に、数字を表示させる関数 (props要素から各スライスの中央位置を算出する)
const RADIAN = Math.PI / 180
const customizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  // 「 ?? 0 」⇒ number | undefined の undefined チェック
  const radius =
    (innerRadius ?? 0) + ((outerRadius ?? 0) - (innerRadius ?? 0)) * 0.5
  const x = (cx ?? 0) + radius * Math.cos(-(midAngle ?? 0) * RADIAN)
  const y = (cy ?? 0) + radius * Math.sin(-(midAngle ?? 0) * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > (cx ?? 0) ? 'start' : 'middle'}
      dominantBaseline="central"
      fontSize={16}
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  )
}

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

            {/*rechartsの棒グラフ*/}
            <div className="pt-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <Bar dataKey="totalMinutes">
                    {chartData.map((item) => (
                      <Cell
                        key={item.id}
                        fill={
                          item.colorToken
                            ? COLOR_MAP[item.colorToken] + '99'
                            : '#5D866C99'
                        }
                      />
                    ))}
                  </Bar>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatMinutes} ticks={yAxisTicks} />
                  <Tooltip
                    formatter={(value) => [
                      typeof value === 'number' ? formatMinutes(value) : value, // typeofで型チェック
                      '合計時間',
                    ]}
                  />
                  <CartesianGrid />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/*rechartsの円グラフ*/}
            <div className="pt-2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart width={500} height={500}>
                  <Pie
                    dataKey="totalMinutes"
                    data={chartData}
                    label={({ name, value }) => {
                      return `${name} ${formatMinutes(value)}`
                    }}
                    labelLine={customizedLabel}
                    startAngle={450} // 12時の軸を基準に
                    endAngle={90}
                  >
                    {chartData.map((item) => (
                      <Cell
                        key={item.id}
                        fill={
                          item.colorToken
                            ? COLOR_MAP[item.colorToken] + '99'
                            : '#5D866C99'
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
