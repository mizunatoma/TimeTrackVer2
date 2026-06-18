import z from 'zod'

export const contactSchema = z.object({
  name: z.string(),
  email: z.email(),
  message: z.string().max(500),
})
