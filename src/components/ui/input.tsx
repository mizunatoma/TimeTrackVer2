import { cn } from '@/lib/utils'
import * as React from 'react'

// ef は props として渡せないから、コールバックの第2引数という位置で受け取る
// React.forwardRef(
//   (props, ref) => {   // 第1引数: 通常のprops / 第2引数: ref
//     return <input ref={ref} {...props} />
//   }
// )

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          'h-10 w-full min-w-0 rounded-lg border-0 bg-gray-100 px-3 py-2 text-base outline-none transition-colors',
          'placeholder:text-muted-foreground',
          'focus-visible:ring-ring/50 focus-visible:ring-2',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:ring-2 aria-invalid:ring-destructive/20',
          'md:text-sm',
          className,
        )}
        {...props}
      />
    )
  },
)
// React DevTools コンポーネントツリーを見たとき、
// forwardRef でラップしたコンポーネントはForwardRef になり分かりづらいため、
// デバッグ用の名前タグ ↓
Input.displayName = 'Input'

export { Input }
