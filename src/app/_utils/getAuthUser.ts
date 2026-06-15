import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { jwtVerify } from '../_lib/jwt'

// 戻り値は { user } か NextResponse のどちらか
export type AuthResult =
  | { user: { id: string } } // 認証成功
  | NextResponse<{ error: string }> // 認証失敗（401レスポンスオブジェクト）

export const getAuthUser = async (): Promise<AuthResult> => {
  // cookies() で jwt クッキーを取得
  const cookieStore = await cookies()
  const token = cookieStore.get('jwt')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // jwtVerify(token) で検証 → payload.userId を取り出す
  const { payload } = await jwtVerify(token.value)
  return { user: { id: payload.userId } }
}
