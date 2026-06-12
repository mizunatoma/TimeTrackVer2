import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const { email } = await request.json()
    // email でユーザーを検索
    const user = await authService.findUser(email)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // resetToken と expirationDate をDBに保存
    const resetToken = await authService.resetPassword(email)

    // メール送信
    const { error } = await authService.sendResetPasswordMail(user, resetToken)
    if (error) {
      return Response.json(
        { message: 'email could not be sent successfully' },
        { status: 400 },
      )
    }

    return NextResponse.json(null, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
