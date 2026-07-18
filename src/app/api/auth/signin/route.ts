import { signinSchema } from '@/schemas/auth'
import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const result = signinSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 })
    }
    // 1. email でユーザーを検索
    const user = await authService.findUser(result.data.email)
    if (!user) {
      // enumeration attack（アカウント存在確認攻撃）
      // 対策「メールが存在しないときもパスワード不一致のときも、同じ 401 を返す」
      return NextResponse.json(
        { message: 'Authentication error' },
        { status: 401 },
      )
    }
    // 2. パスワードを照合
    const isMatch = await authService.verifyPassword(
      result.data.password,
      user.passwordHash,
    )

    // 3. 一致したらJWTトークンを発行・Cookie にセット
    if (isMatch) {
      await authService.issueToken(user.id, user.email)
    } else {
      return NextResponse.json(
        { message: 'Authentication error' },
        { status: 401 },
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
