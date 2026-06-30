import { describe, expect, it } from 'vitest'
import { authService } from './auth.service'

describe('authService - password', () => {
  it('正しいパスワードなら照合が通る(round-trip)', async () => {
    const hash = await authService.createPasswordHash('password123')
    const isMatch = await authService.verifyPassword('password123', hash)
    expect(isMatch).toBe(true)
  })

  it('間違ったパスワードならfalse', async () => {
    const hash = await authService.createPasswordHash('password123')
    const isMatch = await authService.verifyPassword('pass', hash)
    expect(isMatch).toBe(false)
  })

  it('createPasswordHash の出力は平文と異なる', async () => {
    const hash = await authService.createPasswordHash('password123')
    expect(hash).not.toBe('password123')
  })

  it('同じPWを2回ハッシュ化すると互いに違う(salt)', async () => {
    const hash1 = await authService.createPasswordHash('password123')
    const hash2 = await authService.createPasswordHash('password123')
    expect(hash1).not.toBe(hash2)
  })
})
