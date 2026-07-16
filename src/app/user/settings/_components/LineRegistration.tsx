'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineLinkTokenResponse, ProfileResponse } from '@/types/api'
import { useState } from 'react'
import { toast } from 'sonner'
import { useFetch } from '../../_hooks/useFetch'

const LINE_ADD_FRIEND_URL = process.env.NEXT_PUBLIC_LINE_ADD_FRIEND_URL ?? ''

export const LineRegistration = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState('')
  const { data, mutate } = useFetch<ProfileResponse>('/api/profile')

  const isLinked = !!data?.profile?.lineUserId

  const issueToken = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/line/line-token', {
        method: 'POST',
      })
      if (!res.ok) {
        toast.error('トークンの発行に失敗しました')
        return
      }
      toast.success('トークンを発行しました（有効期限10分）')
      const json: LineLinkTokenResponse = await res.json()
      setToken(json.token)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToken = async () => {
    await navigator.clipboard.writeText(token)
    toast.success('コピーしました')
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>LINE連携</CardTitle>
        <p>
          {`毎晩 21:00 に
          その日の学習サマリーを自動通知します。`}
        </p>
        {/*  本番環境で動作確認時に画面切り取り予定
        <Image
          src="/public/images/line-notify-example.png"
          alt="LINE通知の例"
          className="max-w-60 rounded border"
          width={600}
          height={600}
        /> */}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLinked ? (
          <p className="text-sm text-green-600">✅ 連携済みです</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm">1. LINEで友だち追加</p>
              <Button asChild variant="outline">
                <a href={LINE_ADD_FRIEND_URL} target="_blank" rel="noreferrer">
                  友だち追加
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm">2. トークンを発行し、トークで送信</p>
              <Button onClick={issueToken} disabled={isLoading}>
                {isLoading ? '発行中...' : 'トークンを発行'}
              </Button>
            </div>
            {token && (
              <div className="flex items-center gap-2">
                <p className="bg-muted break-all rounded p-2 text-xs">
                  {token}
                </p>
                <Button variant="outline" size="sm" onClick={copyToken}>
                  コピー
                </Button>
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm">3. 送信したら連携状態を確認</p>
              <Button variant="outline" onClick={() => mutate()}>
                連携を確認
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
