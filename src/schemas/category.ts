import { COLOR_OPTIONS } from '@/constants/colors'
import z from 'zod'

export const categorySchema = z.object({
  name: z.string().max(20),
  colorToken: z.enum(COLOR_OPTIONS).nullable(),
})

// categorySchemaの全フィールドが省略可能（partial() ）
export const updateCategorySchema = categorySchema.partial()

export type CreateCategoryRequest = z.infer<typeof categorySchema>
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>
