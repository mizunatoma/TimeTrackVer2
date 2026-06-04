'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import AuthIllustration from '../_components/AuthIllustration'
import { FormButton } from '../_components/form/FormButton'
import { FormInput } from '../_components/form/FormInput'
import { FormLabel } from '../_components/form/FormLabel'

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
      alert('確認メールを送信しました')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="auth-container">
      <AuthIllustration />
      <div className="auth-form-section">
        <div className="auth-card">
          <h1 className="auth-title">Sign up</h1>

          <div className="">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <FormLabel htmlFor="email">メールアドレス</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  loading={isSubmitting}
                  {...register('email', { required: true })}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <FormLabel htmlFor="password">パスワード</FormLabel>
                <FormInput
                  type="password"
                  id="password"
                  loading={isSubmitting}
                  {...register('password', { required: true })}
                  placeholder="password"
                />
              </div>
              <div>
                <FormLabel htmlFor="confirmPassword">
                  パスワード(確認)
                </FormLabel>
                <FormInput
                  type="password"
                  id="confirmPassword"
                  loading={isSubmitting}
                  {...register('confirmPassword', { required: true })}
                  placeholder="password"
                />
              </div>
              <FormButton
                variant="primary"
                loading={isSubmitting}
                label="新規登録"
                className="!mt-8"
              />

              {/*  今後実装予定
              <OrDivider />
              <FormButton variant="secondary" loading={isSubmitting} label='Googleで続行' />
              */}

              <p className="mt-4 text-center text-sm text-gray-600">
                アカウントをお持ちの方は
                <Link
                  href="/login"
                  className="ml-1 text-[#5A8B7D] hover:underline"
                >
                  こちら
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
