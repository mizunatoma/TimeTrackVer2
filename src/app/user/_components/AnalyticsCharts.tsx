'use client'
import { formatMinutes } from '@/app/_utils/format'
import { COLOR_MAP } from '@/constants/colors'
import type { GetAnalyticsResponse } from '@/types/api'
import { memo } from 'react'
import type { PieLabelRenderProps } from 'recharts'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Props = {
  chartData: GetAnalyticsResponse['byCategory']
  yAxisTicks: number[]
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

function AnalyticsCharts({ chartData, yAxisTicks }: Props) {
  return (
    <div>
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
    </div>
  )
}

// 親(analytics/page.tsx)の再レンダリング時、
// propsが同じなら重いグラフ再描画をスキップ（React.memo）
export default memo(AnalyticsCharts)
