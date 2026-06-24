'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FormButton } from '../../components/form/FormButton'
import AuthLayout from '../_components/AuthLayout'

type Form = {
  password: string
  confirmPassword: string
}

export default function Page() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Form>()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const onSubmit = async (data: Form) => {
    try {
      const { password, confirmPassword } = data
      if (password !== confirmPassword) {
        alert('パスワードが一致しません')
        return
      }
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, resetToken: token }),
      })
      if (!res.ok) {
        alert('パスワードの更新に失敗しました')
        return
      }
      reset()
      alert('パスワードを更新しました')
      router.replace('/user/timeline')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthLayout title="Update password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="password">新しいパスワード</Label>
          <Input
            type="password"
            id="password"
            disabled={isSubmitting}
            {...register('password', { required: true })}
            placeholder="••••••••"
          />
        </div>
        <div>
          <Label htmlFor="password">新しいパスワード(確認)</Label>
          <Input
            type="password"
            id="confirmPassword"
            disabled={isSubmitting}
            {...register('confirmPassword', { required: true })}
            placeholder="••••••••"
          />
        </div>
        <FormButton loading={isSubmitting} label="再設定" />
        <div className="mt-2 text-center">
          <Link href="/login" className="text text-[#5A8B7D] hover:underline">
            ログイン画面へ
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
