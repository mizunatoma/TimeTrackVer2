import { prisma } from '@/app/_utils/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    // パスワードをハッシュ化
    const { password, resetToken }:{ password: string; resetToken:string } = await request.json()
    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)
    
    // ユーザを特定
    // DBにpasswordHashを上書き
    // resetToken と expirationDate を nullに戻す (token使い捨て)
    await prisma.user.update({
      where: { 
        resetToken,
        expirationDate: { gt: new Date() },  // 現在時刻より未来のもの (greater than)
      },
      data: { 
        passwordHash,
        resetToken: null,
        expirationDate: null,
      },
    })

    return NextResponse.json({ message: 'OK' })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 })
  }
}
