'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import AuthLayout from '../_components/AuthLayout'

type LoginForm = {
  email: string
  password: string
  confirmPassword: string
}

export default function Page() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LoginForm>()
  const router = useRouter()

  const onSubmit = async (data: LoginForm) => {
    try {
      const { email, password } = data
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        alert('登録に失敗しました')
        return
      }
      reset()
      router.push('/signin')
      alert('アカウントを作成しました')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthLayout title="新規登録">
      <div className="">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              type="email"
              id="email"
              disabled={isSubmitting}
              {...register('email', { required: true })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password">パスワード</Label>
            <Input
              type="password"
              id="password"
              disabled={isSubmitting}
              {...register('password', { required: true })}
              placeholder="password"
            />
          </div>
          <div className="mt-8">
            <Label htmlFor="confirmPassword">パスワード(確認)</Label>
            <Input
              type="password"
              id="confirmPassword"
              disabled={isSubmitting}
              {...register('confirmPassword', { required: true })}
              placeholder="password"
            />
          </div>
          <Button
            variant="outline"
            type="submit"
            disabled={isSubmitting}
            className="w-full border-[#5A8B7D] text-[#5A8B7D] hover:bg-[#F2F0E9]"
          >
            新規登録
          </Button>

          {/*  今後実装予定
              <OrDivider />
              <FormButton variant="secondary" loading={isSubmitting} label='Googleで続行' />
              */}

          <p className="mt-4 text-center text-sm text-gray-600">
            アカウントをお持ちの方は
            <Link
              href="/signin"
              className="ml-1 text-[#5A8B7D] hover:underline"
            >
              こちら
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
