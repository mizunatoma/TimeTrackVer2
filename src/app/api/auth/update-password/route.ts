import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const { password, resetToken } = await request.json()

    // ユーザを特定
    const user = await authService.findResetUser(resetToken)
    if (!user) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    // パスワードをハッシュ化
    const passwordHash = await authService.createPasswordHash(password)
    // ハッシュをアップデート
    const updatedUser = await authService.updateUser(passwordHash, user.email)

    // passwordHash をレスポンスから除外
    const { passwordHash: _, ...safeUser } = updatedUser

    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
