'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { GoalRequest, goalSchema } from '@/schemas/goal'
import { GoalResponse } from '@/types/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useFetch } from '../../_hooks/useFetch'

export const GoalNameSetting = () => {
  const { data, mutate, isLoading } = useFetch<GoalResponse>('/api/goal')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GoalRequest>({
    resolver: zodResolver(goalSchema),
  })

  const onSubmit = async (data: GoalRequest) => {
    try {
      const { qualificationName, examDate, targetStudyTime } = data
      const res = await fetch('/api/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualificationName, examDate, targetStudyTime }),
      })
      if (!res.ok) {
        toast.error('更新に失敗しました')
        return
      }
      toast.success('目標を更新しました')
      mutate()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (data?.goal?.qualificationName) {
      reset({ qualificationName: data.goal.qualificationName })
    }
  }, [data, reset])

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>🚩目標 を編集</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((data) => {
              onSubmit(data)
              reset()
            })}
            className="flex flex-col gap-2"
          >
            <Label htmlFor="qualificationName">資格名：</Label>
            <div className="flex gap-2">
              <Input
                id="qualificationName"
                disabled={isSubmitting}
                placeholder="ゲストさん"
                {...register('qualificationName')}
              />
            </div>
            {errors.qualificationName && (
              <p className="text-sm text-red-500">
                {errors.qualificationName.message}
              </p>
            )}

            <div className="flex gap-2">
              <Label htmlFor="examDate">試験日：</Label>
              <Input
                id="examDate"
                disabled={isSubmitting}
                placeholder="MM / DD"
                {...register('examDate')}
              />
            </div>
            {errors.examDate && (
              <p className="text-sm text-red-500">{errors.examDate.message}</p>
            )}

            <div className="flex gap-2">
              <Label htmlFor="targetStudyTime">目標学習時間：</Label>
              <Input
                id="targetStudyTime"
                disabled={isSubmitting}
                placeholder="300h"
                {...register('targetStudyTime')}
              />
            </div>
            {errors.targetStudyTime && (
              <p className="text-sm text-red-500">
                {errors.targetStudyTime.message}
              </p>
            )}

            <Button disabled={isSubmitting} type="submit" className="shrink-0">
              {isSubmitting ? '更新中...' : '更新'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
