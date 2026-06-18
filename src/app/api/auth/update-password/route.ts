import { updatePasswordSchema } from '@/schemas/auth'
import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const result = updatePasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }

    // ユーザを特定
    const user = await authService.findResetUser(result.data.resetToken)
    if (!user) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    // パスワードをハッシュ化
    const passwordHash = await authService.createPasswordHash(
      result.data.password,
    )
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
