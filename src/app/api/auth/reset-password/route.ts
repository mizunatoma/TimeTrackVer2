import { prisma } from '@/app/_utils/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request: NextRequest) => {
  const { email } = await request.json()

  // email でユーザーを検索
  const user = await prisma.user.findUnique({
    where: { email },
  })
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  // ランダムな Token を生成
  const resetToken = crypto.randomUUID()

  // resetToken と expirationDate をDBに保存
  await prisma.user.update({
    where: { email },
    data: { resetToken, expirationDate: new Date(Date.now() + 60 * 60 * 1000) },
  })

  // メール送信
  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: user.email,
    subject: 'Hello world',
    html: `<p>パスワードリセットは<a href="${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?token=${resetToken}">こちら</a></p>`
  });
  if (error) {
    return Response.json({ error });
  }

  return NextResponse.json({ message: 'ok' })
}




