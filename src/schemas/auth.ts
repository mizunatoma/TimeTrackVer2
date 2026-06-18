import * as z from 'zod'

export const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const signinSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export const resetPasswordSchema = z.object({
  email: z.email(),
})

export const updatePasswordSchema = z.object({
  password: z.string().min(8),
  resetToken: z.string(),
})
