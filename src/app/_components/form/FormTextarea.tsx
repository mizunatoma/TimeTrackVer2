import { forwardRef, TextareaHTMLAttributes } from 'react'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  loading?: boolean
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ loading, className = '', ...props }, ref) => (
    <textarea
      {...props}
      ref={ref}
      disabled={loading}
      className={`block w-full rounded-md border border-gray-300 p-2 disabled:opacity-50 ${className}`}
    />
  ),
)

FormTextarea.displayName = 'FormTextarea'
