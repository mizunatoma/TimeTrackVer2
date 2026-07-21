import z from 'zod'

export const goalSchema = z.object({
  qualificationName: z.string().min(1),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  targetStudyTime: z.coerce.number().int().max(10000),
})

// Zodスキーマから型を自動生成
export type GoalRequest = z.infer<typeof goalSchema>
