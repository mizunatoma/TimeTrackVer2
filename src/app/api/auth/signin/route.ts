import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()
    // 1. email でユーザーを検索
    const user = await authService.findUser(email)
    if (!user) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }
    // 2. パスワードを照合
    const isMatch = await authService.verifyPassword(password, user.passwordHash)
    
    // 3. 一致したらJWTトークンを発行・Cookie にセット
    if (isMatch) {
      await authService.issueToken(user.id)
    } else {
      return NextResponse.json({ message: 'mismatch Password' }, { status: 401 })
    }

    return NextResponse.json(null, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
