import z from 'zod'

export const startTimelogSchema = z.object({
  activityId: z.string(),
})

export const dateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const dateRangeQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const periodQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month']),
  page: z.coerce.number().int().max(0), //.coerce 強制する, .int() 少数を拒否
})

export type StartTimelogRequest = z.infer<typeof startTimelogSchema>
