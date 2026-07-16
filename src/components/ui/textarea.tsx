import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        'placeholder:text-muted-foreground focus-visible:ring-ring/50 aria-invalid:ring-2 aria-invalid:ring-destructive/20 flex min-h-[120px] w-full rounded-lg border-0 bg-gray-100 px-3 py-2 text-base outline-none transition-colors focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
