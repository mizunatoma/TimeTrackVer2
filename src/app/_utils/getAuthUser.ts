import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { jwtVerify } from '../_lib/jwt'

// 戻り値は { user } か NextResponse のどちらか
export type AuthResult =
  | { user: { id: string }; isGuest: boolean } // 認証成功
  | NextResponse<{ error: string }> // 認証失敗（401レスポンスオブジェクト）

export const getAuthUser = async (): Promise<AuthResult> => {
  // cookies() で jwt クッキーを取得
  const cookieStore = await cookies()
  const token = cookieStore.get('jwt')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // jwtVerifyでtokenを検証し、正しければ中身を取り出す
  const { payload } = await jwtVerify(token.value)

  return {
    user: {
      id: payload.userId,
    },
    isGuest: payload.isGuest ?? false, // undefinedならfalse扱い
  }
}
