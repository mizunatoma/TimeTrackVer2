'use client'
import { useFetch } from '@/app/user/_hooks/useFetch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { startTimelogSchema } from '@/schemas/timeline'
import type { GetRunningTimelogResponse } from '@/types/api'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'

type Props = {
  currentCategoryID: { id: string; count: number }
  onPressStopButton: Dispatch<SetStateAction<{ count: number }>>
}

export default function CurrentCategoryWidget({
  currentCategoryID,
  onPressStopButton,
}: Props) {
  const [elapsed, setElapsed] = useState(0)
  const { data, isLoading, mutate, isValidating } =
    useFetch<GetRunningTimelogResponse | null>('/api/timeline/running')

  // タイムトラックの開始
  const start = useCallback(async () => {
    // useCallback: 関数をメモ化して無限ループを防ぐ
    try {
      const result = startTimelogSchema.safeParse({
        activityId: currentCategoryID.id,
      })
      if (!result.success) {
        console.error('バリデーション失敗', result.error)
        return
      }

      const res = await fetch('/api/timeline/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      if (!res.ok) {
        console.error('タイムトラックの開始失敗', await res.json())
        return
      }
      mutate()
    } catch (e) {
      console.error('タイムトラックの開始エラー：', e)
    }
  }, [currentCategoryID, mutate])

  useEffect(() => {
    if (!currentCategoryID.id) return // 選択されていなければなにもしない
    start()
  }, [currentCategoryID, start])

  // タイムトラックの停止
  const handleStop = async () => {
    try {
      const res = await fetch('/api/timeline/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        console.error('タイムトラックの停止失敗', await res.json())
        return
      }
      mutate()
      onPressStopButton((s) => ({ count: s.count + 1 }))
    } catch (e) {
      console.error('タイムトラックの停止エラー：', e)
    }
  }

  // 経過時間の表示
  useEffect(() => {
    if (!data?.running) return // running中でなければなにもしない

    const timer = setInterval(() => {
      const now = new Date()
      const start = new Date(data.log.startAt)
      const minutes = Math.floor((now.getTime() - start.getTime()) / 60000) // getTime()でDate型をnumberに変換
      setElapsed(minutes)
    }, 60000) // 1分ごと

    return () => clearInterval(timer)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Now Tracking</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-col gap-3 rounded-xl bg-[#5D866C]/10 p-4">
              <div className="flex w-full items-center gap-3">
                {data?.running ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-3 shrink-0 rounded-full shadow-sm ${data.log.colorToken}`}
                      />
                      <span>{data.log.activityName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        開始:{' '}
                        {new Date(data.log.startAt).toLocaleTimeString(
                          'ja-JP',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}{' '}
                      </span>
                      <span className="text-xs text-gray-500">
                        経過: {elapsed}分
                      </span>
                    </div>
                  </div>
                ) : (
                  <span>実行中なし</span>
                )}
              </div>

              {data?.running && (
                <div className="">
                  <Button
                    className="mt-1 w-full bg-rose-200 text-rose-800 hover:bg-rose-300"
                    disabled={isValidating}
                    onClick={handleStop}
                  >
                    {' '}
                    停止
                  </Button>

                  {/* 今後実装予定
                    < div className="relative mt-4 ">
                      <textarea
                        className="w-full h-24 bg-gray-50 rounded-xl p-4 text-gray-700 border-rose-100 border-2 focus:outline-none focus:ring-2 focus:ring-rose-100 placeholder-gray-400"
                        placeholder="(任意)終了時にメモを残します"
                      />
                    </div>
                    */}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
