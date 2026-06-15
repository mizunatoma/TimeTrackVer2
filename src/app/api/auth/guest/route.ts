// /api/guest
import { authService } from '@/services/auth.service'
import { NextResponse } from 'next/server'

export const POST = async () => {
  try {
    // ゲストログイン情報を取得
    const guestUser = await authService.findGuestUser()
    if (!guestUser) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }
    //JWTトークンを発行して Cookie にセット
    await authService.issueToken(guestUser.id)

    return NextResponse.json(null, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
