'use client'
import type { ContactBody } from '@/types/api'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { FormButton } from '../_components/form/FormButton'
import { FormInput } from '../_components/form/FormInput'
import { FormLabel } from '../_components/form/FormLabel'
import { FormTextarea } from '../_components/form/FormTextarea'

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

      if (res.ok) {
        alert('送信しました')
        reset()
      } else {
        alert('送信に失敗しました')
      }
    } catch (err) {
      console.error(err)
      alert('エラーが発生しました')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F2F0E9] px-4">
      <div className="auth-card w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h1 className="auth-title">お問い合わせ</h1>
          <div>
            <FormLabel htmlFor="name">お名前</FormLabel>
            <FormInput
              loading={isSubmitting}
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
            <FormLabel htmlFor="email">メールアドレス</FormLabel>
            <FormInput
              loading={isSubmitting}
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
            <FormLabel htmlFor="text">本文</FormLabel>
            <FormTextarea
              rows={5}
              loading={isSubmitting}
              {...register('message', { required: '本文は必須です' })}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">
                {errors.message.message}
              </p>
            )}
          </div>
          <FormButton type="submit" loading={isSubmitting} label="送信" />
          <div className="text flex justify-center hover:underline">
            <Link href="/user/timeline">ダッシュボードに戻る</Link>
          </div>
        </form>
      </div>
    </main>
  )
}
