import z from 'zod'

export const profileSchema = z.object({
  displayName: z.string(),
})

export type UpdateProfileRequest = z.infer<typeof profileSchema>
