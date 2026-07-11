import z from 'zod'

export const contactSchema = z.object({
  name: z.string().max(50),
  email: z.email().max(254),
  message: z.string().max(500),
})
