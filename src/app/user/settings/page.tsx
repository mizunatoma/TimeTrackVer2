'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { profileSchema, UpdateProfileRequest } from '@/schemas/profile'
import { useUserStore } from '@/store/userStore'
import { ProfileResponse } from '@/types/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useFetch } from '../_hooks/useFetch'

export default function Page() {
  const setUser = useUserStore((state) => state.setUser)
  const { data, mutate } = useFetch<ProfileResponse>('/api/profile')

  //  useForm + zodResolver(profileSchema) でフォームを初期化
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = async (data: UpdateProfileRequest) => {
    try {
      const { displayName } = data
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName }),
      })
      if (!res.ok) {
        alert('更新に失敗しました')
        return
      }
      const json: ProfileResponse = await res.json()
      setUser(json.profile)
      mutate()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (data?.profile?.displayName) {
      reset({ displayName: data.profile.displayName })
    }
  }, [data, reset])

  return (
    <div className="p-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>プロフィール編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => {
              onSubmit(data)
              reset()
            })}
            className="flex flex-col gap-2"
          >
            <Label htmlFor="displayName">表示名</Label>
            <div className="flex gap-2">
              <Input
                id="displayName"
                disabled={isSubmitting}
                placeholder="ゲストさん"
                {...register('displayName')}
              />
              <Button
                disabled={isSubmitting}
                type="submit"
                className="shrink-0"
              >
                {isSubmitting ? '更新中...' : '更新'}
              </Button>
            </div>
            {errors.displayName && (
              <p className="text-sm text-red-500">
                {errors.displayName.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
