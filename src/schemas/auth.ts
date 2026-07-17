import * as z from 'zod'

export const signupSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // エラーをどのフィールドに紐づけるか
  })

export const signinSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export const resetPasswordSchema = z.object({
  email: z.email(),
})

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
    resetToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // エラーをどのフィールドに紐づけるか
  })
