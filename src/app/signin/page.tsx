'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FormButton } from '../../components/form/FormButton'
import OrDivider from '../../components/form/OrDivider'
import AuthLayout from '../_components/AuthLayout'
import GuestLogin from '../_components/GuestLogin'

type LoginForm = {
  email: string
  password: string
}

export default function Page() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      const { email, password } = data
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        alert('ログインに失敗しました')
        return
      }
      router.replace('/user/timeline')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthLayout title="ログイン">
      <form
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
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
        <div className="">
          <Label htmlFor="password">パスワード</Label>
          <Input
            type="password"
            id="password"
            disabled={isSubmitting}
            {...register('password', { required: true })}
            placeholder="••••••••"
          />
        </div>

        <div className="flex">
          <Link
            href="/reset-password"
            className="ml-auto block text-sm text-[#5A8B7D] hover:underline"
          >
            パスワードをお忘れの場合
          </Link>
        </div>

        {/*  今後実装予定
          <div className="flex items-center justify-between">
            <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-[#5A8B7D] bg-gray-100 border-gray-300 rounded focus:ring-[#5A8B7D]"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">ログイン状態を保持</label>
            </div>
          </div>
          */}

        <div className="flex flex-col gap-3">
          <FormButton
            variant="primary"
            loading={isSubmitting}
            label="ログイン"
          />
          <Button asChild variant="outline" className="h-12 w-full rounded-xl">
            <Link href="/signup">新規登録</Link>
          </Button>
        </div>

        <OrDivider />

        {/*
            <FormButton
              variant="secondary"
              loading={isSubmitting}
              label="Googleで続行"
            />
            */}

        <GuestLogin
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-11 w-full rounded-lg',
          )}
          label="ゲストで見る"
        />
      </form>
    </AuthLayout>
  )
}
