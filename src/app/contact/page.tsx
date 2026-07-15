'use client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ContactBody } from '@/types/api'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormButton } from '../../components/form/FormButton'

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactBody>()

  const onSubmit = async (data: ContactBody) => {
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        toast.error('送信に失敗しました')
        return
      }
      toast.success('送信しました')
      reset()
    } catch (err) {
      console.error(err)
      toast.error('エラーが発生しました')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F2F0E9] px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
            お問い合わせ
          </h1>
          <div>
            <Label htmlFor="name">お名前</Label>
            <Input
              disabled={isSubmitting}
              {...register('name', {
                required: '名前は必須です',
                maxLength: {
                  value: 30,
                  message: '30文字以内で入力してください',
                },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              disabled={isSubmitting}
              {...register('email', {
                required: 'メールアドレスは必須です',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '正しいメールアドレスを入力してください',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="text">本文</Label>
            <Textarea
              rows={5}
              disabled={isSubmitting}
              {...register('message', { required: '本文は必須です' })}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>
          <FormButton type="submit" loading={isSubmitting} label="送信" />
          <div className="flex justify-center text-sm font-bold text-gray-600 hover:underline">
            <Link href="/user/timeline">ダッシュボードに戻る</Link>
          </div>
        </form>
      </Card>
    </main>
  )
}
