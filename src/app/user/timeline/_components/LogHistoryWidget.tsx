'use client'
import { formatMinutes } from '@/app/_utils/format'
import { useFetch } from '@/app/user/_hooks/useFetch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GetLogsPaginatedResponse } from '@/types/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const LIMIT = 10

const calcMinutes = (startAt: string, endAt: string) => {
  const end = new Date(endAt)
  const start = new Date(startAt)
  const minutes = Math.floor((end.getTime() - start.getTime()) / 60000) // getTime()でDate型をnumberに変換
  return minutes
}

const formatTimeRange = (startAt: string, endAt: string) => {
  const start = new Date(startAt).toLocaleString('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  const end = new Date(endAt).toLocaleString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${start} ~ ${end}`
}

export const LogHistoryWidget = () => {
  const [page, setPage] = useState(1)

  const { data } = useFetch<GetLogsPaginatedResponse>(
    `/api/timeline/logs?page=${page}&limit=${LIMIT}`,
    { keepPreviousData: true }, // ページ切替中も前ページを表示し続け、リストが消えてガクつくのを防ぐ  )
  )

  if (!data) return <p>読み込み中...</p>

  const totalPages = Math.ceil(data.total / LIMIT)

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <ul className="w-max min-w-full space-y-2">
            {data.logs.map((log) => (
              <li
                key={log.id}
                className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm"
              >
                <div
                  className={`size-3 shrink-0 rounded-full ${log.activity.colorToken}`}
                ></div>
                <span className="shrink-0 text-sm font-bold text-gray-600">
                  {log.activity.name}
                </span>
                <span className="shrink-0 text-xs text-gray-500">
                  {formatTimeRange(log.startAt, log.endAt)}
                </span>
                <span className="w-14 shrink-0 text-right text-sm font-bold text-gray-600">
                  {formatMinutes(calcMinutes(log.startAt, log.endAt))}
                </span>
                <span
                  className="flex-1 whitespace-nowrap text-xs text-gray-400"
                  title={log.memo ?? ''}
                >
                  {log.memo}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ページナビ */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
