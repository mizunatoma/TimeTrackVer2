'use client'
import { useFetch } from '@/app/user/_hooks/useFetch'
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
  const [date, setDate] = useState(toJstDateString(new Date()))

  const { data, mutate } = useFetch<GetTimelogResponse | null>(
    `/api/timeline?date=${date}`,
  )

  useEffect(() => {
    mutate()
  }, [timelineKey, mutate])

  return (
    <div className="widget-card flex h-[calc(100vh-140px)] flex-col">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => {
            const prev = new Date(date)
            prev.setDate(prev.getDate() - 1)
            setDate(toJstDateString(prev))
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="section-title mb-0">{date}</h2>
        <button
          onClick={() => {
            const prev = new Date(date)
            prev.setDate(prev.getDate() + 1)
            setDate(toJstDateString(prev))
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="relative h-[1440px] overflow-y-auto">
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
      </div>
    </div>
  )
}
