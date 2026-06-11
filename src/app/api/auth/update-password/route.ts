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
    const user = await prisma.user.findFirst({
      where: { 
        resetToken, 
        expirationDate: { gt: new Date() } // 現在時刻より未来のもの (greater than) }}
      }  
    }) 
      if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      }

    await prisma.user.update({
      // updateのwhereで指定できるのは@id, @uniqueのみ！
      where: { id: user.id },
      data: { 
        // DBにpasswordHashを上書き
        passwordHash,
        // resetToken と expirationDate を nullに戻す (token使い捨て)
        resetToken: null,
        expirationDate: null,
      },
    })

    return NextResponse.json({ message: 'OK' })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 })
  }
}
