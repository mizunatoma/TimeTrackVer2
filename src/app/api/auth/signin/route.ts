import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json()
  // 1. email でユーザーを検索
  const user = await authService.findUser(email)
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  // 2. パスワードを照合
  const isMatch = await authService.verifyPassword(password, user.passwordHash)
  // 3. 一致したらJWTトークンを発行・Cookie にセット
  if (isMatch) {
    try {
      await authService.issueToken(user.id)
      return NextResponse.json({ message: 'ok' })
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 400 })
    }
  }
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}
