'use client'
import { useFetch } from '@/app/user/_hooks/useFetch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GetLogsPaginatedResponse } from '@/types/api'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { LogRow } from './LogRow'

const LIMIT = 10

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
              <LogRow key={log.id} log={log} />
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
