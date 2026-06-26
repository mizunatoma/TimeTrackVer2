'use client'
import { useFetch } from '@/app/user/_hooks/useFetch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDebounce } from '@/hooks/useDebounce'
import type { GetTimelogResponse } from '@/types/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  timelineKey: { count: number }
}

const toJstDateString = (date: Date): string => {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

export default function TimelogWidget({ timelineKey }: Props) {
  const hours = Array.from({ length: 24 }, (_, i) => i) // [0, 1, 2, ... 23]
  const [period] = useState<'day' | 'week' | 'month'>('day')
  const [page, setPage] = useState(0)
  const debouncedPage = useDebounce(page, 300)

  const { data, mutate } = useFetch<GetTimelogResponse | null>(
    `/api/timeline?period=${period}&page=${debouncedPage}`,
  )

  useEffect(() => {
    mutate()
  }, [timelineKey, mutate])

  const getLabel = () => {
    const today = new Date()
    if (period === 'day') {
      const d = new Date(today)
      d.setDate(today.getDate() + page)
      return toJstDateString(d)
    } else if (period === 'week') {
      const d = new Date(today)
      d.setDate(today.getDate() + page * 7)
      const jan1 = new Date(d.getFullYear(), 0, 1)
      const weekNum = Math.ceil(
        ((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
      )
      return `第 ${weekNum} 週`
    } else {
      const d = new Date(today.getFullYear(), today.getMonth() + page, 1)
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
    }
  }

  return (
    <Card className="flex h-[calc(100vh-140px)] flex-col">
      <CardHeader>
        {/* 日 週 月 切替ボタン */}
        {/* <div className="flex justify-center gap-1">
          <button
            onClick={() => {
              setPeriod('day')
              setPage(0)
            }}
            className={
              period === 'day' ? 'font-bold underline' : 'text-gray-400'
            }
          >
            日
          </button>
          <button
            onClick={() => {
              setPeriod('week')
              setPage(0)
            }}
            className={
              period === 'week' ? 'font-bold underline' : 'text-gray-400'
            }
          >
            週
          </button>
          <button
            onClick={() => {
              setPeriod('month')
              setPage(0)
            }}
            className={
              period === 'month' ? 'font-bold underline' : 'text-gray-400'
            }
          >
            月
          </button>
        </div> */}

        {/* < label > */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              setPage((p) => p - 1)
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <CardTitle>{getLabel()}</CardTitle>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= 0}
            className={page >= 0 ? 'text-gray-300' : ''}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="relative h-[1440px] overflow-y-auto">
        {/* 左側：時刻表示 */}
        {hours.map((hour) => (
          <div key={hour} className="flex h-[60px] border-b border-gray-100">
            <div className="w-16 py-2 pr-4 text-right font-mono text-xs text-gray-400">
              {String(hour).padStart(2, '0')}:00
            </div>
          </div>
        ))}

        {/* 右側：記録一覧 */}
        {data?.activities.map((activity) => {
          if (activity.endAt === null) return
          const start = new Date(activity.startAt)
          const end = new Date(activity.endAt)
          const startMinutes = start.getHours() * 60 + start.getMinutes()
          const endMinutes = end.getHours() * 60 + end.getMinutes()
          const height = endMinutes - startMinutes

          return (
            <div
              key={activity.id}
              className={`absolute left-16 right-0 top-0 mb-1 h-full truncate rounded-md p-1 text-xs ${activity.category.colorToken}`}
              style={{ top: `${startMinutes}px`, height: `${height}px` }}
            >
              {activity.title}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
