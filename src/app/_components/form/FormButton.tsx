import { ButtonHTMLAttributes, forwardRef } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading: boolean
  label: string
  type?: 'submit' | 'button'
  variant?: 'primary' | 'secondary'
}

export const FormButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      loading,
      label,
      type = 'submit', // デフォルト値の指定
      variant = 'primary', // デフォルト値の指定
      className = '',
      ...props
    },
    ref,
  ) => (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={loading}
      className={`accunt_button ${className} ${
        variant === 'primary'
          ? 'bg-[#5A8B7D] text-white hover:bg-[#4A7A6D]'
          : 'bg-[#F5F3ED] text-gray-700 hover:bg-[#EBE9E0]'
      }`}
    >
      {loading ? '送信中...' : label}
    </button>
  ),
)
// forwardRefで包むと名前が消えるため、displayName を手動でつけて、ESLintエラーを回避
FormButton.displayName = 'FormButton'
