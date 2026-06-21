import z from 'zod'

export const profileSchema = z.object({
  displayName: z.string().trim().min(1),
})

export type UpdateProfileRequest = z.infer<typeof profileSchema>
