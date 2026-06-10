import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { jwtVerify } from '../_lib/jwt'

// userId or Next.jsのレスポンスオブジェクト（エラーメッセージ）を返す
export type AuthResult = { user: {id: string} } | NextResponse<{ error: string }>

export const getAuthUser = async (): Promise<AuthResult> => {
  try {
    // cookies() で jwt クッキーを取得
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // jwtVerify(token) で検証 → payload.userId を取り出す
    const { payload } = await jwtVerify(token.value)
    return { user: { id: payload.userId} }
  } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
