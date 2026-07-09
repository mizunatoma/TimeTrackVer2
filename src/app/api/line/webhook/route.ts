// /api/line/webhook
import { logger } from '@/lib/logger'
import { lineLinkTokenService } from '@/services/lineLinkToken.service'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    // ヘッダーから署名を取る
    const rawBody = await request.text()
    const signature = request.headers.get('x-line-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 自分でもハッシュ値を計算をする
    const hash = crypto
      .createHmac('sha256', process.env.LINE_CHANNEL_SECRET!)
      .update(rawBody)
      .digest('base64')
    if (hash !== signature) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    await lineLinkTokenService.handleEvents(body.events)

    return NextResponse.json({ body }, { status: 200 })
  } catch (e) {
    logger.error('POST /api/line/webhook error', {
      error: e instanceof Error ? e.stack : String(e),
    })

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
