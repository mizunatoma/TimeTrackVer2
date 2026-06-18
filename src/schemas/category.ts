import { COLOR_OPTIONS } from '@/constants/colors'
import z from 'zod'

export const categorySchema = z.object({
  name: z.string(),
  colorToken: z.enum(COLOR_OPTIONS).nullable(),
})
// categorySchemaの全フィールドが省略可能（partial() ）
export const updateCategorySchema = categorySchema.partial()

export const nameSchema = z.object({
  name: z.string(),
})
