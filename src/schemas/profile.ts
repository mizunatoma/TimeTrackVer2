import z from 'zod'

export const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(50),
})

export type UpdateProfileRequest = z.infer<typeof profileSchema>
