import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/auth/callback?token=xxx

export const GET = async (request: NextRequest) => {
  try {
    // reset-password で作成したtokenを検索 → どのユーザーか特定
    const { searchParams } = request.nextUrl
    const token = searchParams.get('token')
    if (!token) {
      return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
    }

    const user = await authService.findResetUser(token)
    if (!user) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    // OKなら → /update-passwordページへリダイレクト
    return NextResponse.redirect(
      new URL(`/update-password?token=${token}`, request.url),
    )
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
