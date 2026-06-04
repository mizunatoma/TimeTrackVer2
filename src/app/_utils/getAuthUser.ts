// APIルートで「誰がリクエストしてるか」を取り出す
// 使用先：全 route.ts の先頭

import type { User } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient } from '../_lib/supabase/createClient'

// userオブジェクト or Next.jsのレスポンスオブジェクト（エラーメッセージ）を返す、と定義
export type AuthResult = { user: User } | NextResponse<{ error: string }>

export const getAuthUser = async (): Promise<AuthResult> => {
  // クライアントの初期化
  const supabase = await createClient()

  // Supabaseサーバーに問い合わせてトークン(証明書)を検証
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return { user }
}
