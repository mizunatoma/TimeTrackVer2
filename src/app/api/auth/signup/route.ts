import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json(
        { message: 'password or email address is missing' },
        { status: 400 },
      )
    }

    // パスワードをハッシュ化
    const passwordHash = await authService.createPasswordHash(password)
    // ユーザを新規作成
    const newUser = await authService.createUser(passwordHash, email)

    // passwordHash をレスポンスから除外
    const { passwordHash: _, ...safeUser } = newUser

    return NextResponse.json({ user: safeUser }, { status: 201 })
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
