import { getAuthUser } from '@/app/_utils/getAuthUser'
import { logger } from '@/lib/logger'
import { lineLinkTokenService } from '@/services/lineLinkToken.service'
import type { LineLinkTokenResponse } from '@/types/api'
import { NextResponse } from 'next/server'

export const POST = async () => {
  try {
    const auth = await getAuthUser()
    if (auth instanceof NextResponse) return auth
    const user = auth.user

    if (auth.isGuest) {
      return NextResponse.json(
        { error: 'Authorization failure' },
        { status: 403 },
      )
    }

    const token = await lineLinkTokenService.issueToken(user.id)
    if (!token) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json<LineLinkTokenResponse>({ token }, { status: 200 })
  } catch (e) {
    logger.error('POST /line/line-token error', {
      error: e instanceof Error ? e.stack : String(e),
    })

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
