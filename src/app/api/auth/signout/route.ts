import { createClient } from '@/app/_lib/supabase/createClient'
import { NextResponse } from 'next/server'

export const POST = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.json({ message: 'ok' })
}
