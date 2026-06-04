// /api/guest

import { createClient } from '@/app/_lib/supabase/createClient'
import { NextResponse } from 'next/server'

export const POST = async () => {
  const email: string = process.env.GUEST_EMAIL!
  const password: string = process.env.GUEST_PASSWORD!

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
  return NextResponse.json({ message: 'ok' })
}
