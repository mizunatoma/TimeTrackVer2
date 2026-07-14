import { formatMinutes } from '@/app/_utils/format'
import { GetLogsPaginatedResponse } from '@/types/api'
import { memo } from 'react'

type Props = {
  log: GetLogsPaginatedResponse['logs'][number]
  // 配列の型から、そのうちの1個分の型を取り出す (indexed access type)
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

const calcMinutes = (startAt: string, endAt: string) => {
  const end = new Date(endAt)
  const start = new Date(startAt)
  const minutes = Math.floor((end.getTime() - start.getTime()) / 60000) // getTime()でDate型をnumberに変換
  return minutes
}

export const LogRow = memo(function LogRow({ log }: Props) {
  return (
    <li className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm">
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
  )
})
