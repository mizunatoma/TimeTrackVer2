'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import AuthIllustration from '../_components/AuthIllustration'
import { FormButton } from '../_components/form/FormButton'
import { FormInput } from '../_components/form/FormInput'
import { FormLabel } from '../_components/form/FormLabel'
import OrDivider from '../_components/form/OrDivider'

type LoginForm = {
  email: string
  password: string
}

export default function Page() {
  const [loading, setLoading] = useState(false) // ゲストログイン用
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

  const guestLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        alert('ログインに失敗しました')
        return
      }
      router.replace('/user/timeline')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <AuthIllustration />
      <div className="auth-form-section">
        <div className="auth-card">
          <h1 className="auth-title">Login</h1>
          <form
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <FormLabel htmlFor="email">メールアドレス</FormLabel>
              <FormInput
                type="email"
                id="email"
                loading={isSubmitting}
                {...register('email', { required: true })}
                placeholder="name@company.com"
              />
            </div>
            <div className="">
              <FormLabel htmlFor="password">パスワード</FormLabel>
              <FormInput
                type="password"
                id="password"
                loading={isSubmitting}
                {...register('password', { required: true })}
                placeholder="••••••••"
              />
            </div>

            <div className="flex">
              <Link
                href="/reset_password"
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
              <Link href="/signup" className="accunt_button">
                新規登録
              </Link>
            </div>

            <OrDivider />

            {/*
            <FormButton
              variant="secondary"
              loading={isSubmitting}
              label="Googleで続行"
            />
            */}

            <FormButton
              onClick={guestLogin}
              loading={loading}
              label="ゲストで見る"
              type="button"
              variant="secondary"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
