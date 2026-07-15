'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FormButton } from '../../components/form/FormButton'
import AuthLayout from '../_components/AuthLayout'

type ResetPasswordForm = {
  email: string
}

export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ResetPasswordForm>()

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const { email } = data
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        toast.error('リセットメールの送信に失敗しました')
        return
      }
      reset()
      toast.success('パスワード再設定用のメールを送信しました')
    } catch (error) {
      console.log(error)
      toast.error('エラーが発生しました')
    }
  }

  return (
    <AuthLayout title="Reset password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            type="email"
            id="email"
            disabled={isSubmitting}
            {...register('email', { required: true })}
            placeholder="name@company.com"
          />
        </div>
        <p className="flex whitespace-pre-wrap text-xs leading-relaxed text-gray-500">
          {`登録したメールアドレスに、パスワード再設定用のリンクを送ります。\n※届かない場合は、迷惑メールも確認してください。`}
        </p>
        <FormButton loading={isSubmitting} label="再設定リンクを送信" />
        <div className="mt-2 text-center">
          <Link href="/login" className="text text-[#5A8B7D] hover:underline">
            ログインに戻る
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
