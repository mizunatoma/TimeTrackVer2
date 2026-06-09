import { prisma } from '@/app/_utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/auth/callback?token=xxx

export const GET = async (request: NextRequest) => {
  try{
    // resset-password で作成したtokenを検索 → どのユーザーか特定
    const { searchParams } = request.nextUrl
    const token = searchParams.get('token')
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized ' }, { status: 401 })
      }

    const user = await prisma.user.findFirst({
          where: { resetToken: token },
        })
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized ' }, { status: 401 })
    }

    // 有効期限チェック (nullable)
    if (!user.expirationDate || user.expirationDate < new Date()) {
      return NextResponse.json({ message: 'Token expired' }, { status: 401 })
    }
    // OKなら → /update-passwordページへリダイレクト
    return NextResponse.redirect(new URL(`/update-password?token=${token}`, request.url))
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 })
  }
}
