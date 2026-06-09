import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const POST = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('jwt')
  return NextResponse.json({ message: 'ok' })
}
