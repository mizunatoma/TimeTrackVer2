import { forwardRef, InputHTMLAttributes } from 'react'

// <input>に渡せる全属性をPropsとして受け取る
type Props = InputHTMLAttributes<HTMLInputElement> & {
  loading: boolean
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ loading, className = '', ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      disabled={loading}
      className={`block w-full rounded-md border border-transparent bg-[#F5F3ED] p-2 disabled:opacity-50 ${className}`}
    />
  ), // className={`... ${className}`}で上書き可能に
)

FormInput.displayName = 'FormInput'
