import { describe, expect, it } from 'vitest'
import { signupSchema } from './auth'

describe('signupSchema', () => {
  it('正しいemailとpasswordなら通る', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'password123', // 8文字以上
      confirmPassword: 'password123', // 同一の8文字以上
    })
    expect(result.success).toBe(true)
  })

  it('壊れたEmail形式なら弾く', () => {
    const result = signupSchema.safeParse({
      email: 'abc', // 不正形式
      password: 'password123', // 8文字以上
      confirmPassword: 'password123', // 同一の8文字以上
    })
    expect(result.success).toBe(false)
  })

  it('passwordが7文字なら弾く', () => {
    const result = signupSchema.safeParse({
      email: 'test@example.com',
      password: 'pass123', // 7文字
      confirmPassword: 'pass123', // 同一の7文字
    })
    expect(result.success).toBe(false)
  })
})
