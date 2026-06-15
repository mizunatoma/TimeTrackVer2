import { authService } from '@/services/auth.service'
import { NextResponse } from 'next/server'

export const POST = async () => {
  try {
    await authService.deleteToken()

    return NextResponse.json(null, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
