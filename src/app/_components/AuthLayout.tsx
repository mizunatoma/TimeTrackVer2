import { ReactNode } from 'react'
import AuthIllustration from './AuthIllustration'

type Props = {
  title: string
  children: ReactNode
}

export default function AuthLayout({ title, children }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/*左カラム*/}
      <AuthIllustration />

      {/*右カラム*/}
      <div className="flex h-full items-center justify-center bg-background p-8">
        {/*カード*/}
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          {/*タイトル*/}
          <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </div>
  )
}
