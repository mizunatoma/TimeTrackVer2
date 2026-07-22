import z from 'zod'

export const goalSchema = z.object({
  qualificationName: z
    .string()
    .min(1, '資格名は必須です')
    .max(30, '30文字以内で入力してください'),

  examDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '試験日の形式が正しくありません')
    .refine((val) => {
      const todayJST = new Date(Date.now() + 9 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      return val >= todayJST
    }, '過去の日付は選択できません'),

  targetStudyTime: z.coerce
    .number()
    .int()
    .min(1, '1時間以上を入力してください')
    .max(10000, '10000時間以内で入力してください'),
})

// Zodスキーマから型を自動生成
export type GoalRequest = z.infer<typeof goalSchema>
