import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  try{
  const { email, password } = await request.json()

  const newUser = await authService.createPasswordHash(password, email)
  // passwordHash をレスポンスから除外
  const {passwordHash: _, ...safeUser}  = newUser

  return NextResponse.json({ user: safeUser })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 })
  }
}