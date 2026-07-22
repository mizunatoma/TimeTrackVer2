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
import z from 'zod'
import { useFetch } from '../../_hooks/useFetch'

export const GoalNameSetting = () => {
  const { data, mutate, isLoading } = useFetch<GoalResponse>('/api/goal')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.input<typeof goalSchema>, unknown, z.output<typeof goalSchema>>(
    // z.coerce.number()でZodの入力型と出力型が異なるため、useFormに変換前と変換後の型を指定
    {
      resolver: zodResolver(goalSchema),
    },
  )

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
    if (data?.goal) {
      reset({
        qualificationName: data.goal.qualificationName,
        examDate: data.goal.examDate.slice(0, 10),
        targetStudyTime: data.goal.targetStudyTime,
      })
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
            <div className="flex items-center gap-2">
              <Label htmlFor="qualificationName" className="w-28 shrink-0">
                資格名：
              </Label>
              <Input
                id="qualificationName"
                disabled={isSubmitting}
                placeholder="基本情報技術者試験"
                className="flex-1"
                {...register('qualificationName')}
              />
            </div>
            {errors.qualificationName && (
              <p className="text-sm text-red-500">
                {errors.qualificationName.message}
              </p>
            )}

            <div className="flex items-center gap-2">
              <Label htmlFor="examDate" className="w-28 shrink-0">
                試験日：
              </Label>
              <Input
                id="examDate"
                type="date"
                disabled={isSubmitting}
                className="flex-1"
                {...register('examDate')}
              />
            </div>
            {errors.examDate && (
              <p className="text-sm text-red-500">{errors.examDate.message}</p>
            )}

            <div className="flex items-center gap-2">
              <Label htmlFor="targetStudyTime" className="w-28 shrink-0">
                目標学習時間：
              </Label>
              <Input
                id="targetStudyTime"
                type="number"
                min={0}
                disabled={isSubmitting}
                placeholder="300"
                className="flex-1"
                {...register('targetStudyTime')}
              />
            </div>
            {errors.targetStudyTime && (
              <p className="text-sm text-red-500">
                {errors.targetStudyTime.message}
              </p>
            )}

            <div className="flex justify-end">
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? '更新中...' : '更新'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
