import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { COOKIE_OPTIONS } from './app/_lib/supabase/cookieOptions'

// ホワイトリスト定義
const PUBLIC_PATH = ['/login', '/signup', '/api/auth/guest']

export const middleware = async (request: NextRequest) => {
  const ref = { response: NextResponse.next({ request }) }

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        // ブラウザから届いたcookieを取り出す
        getAll: () => request.cookies.getAll(),
        // 新しいcookieをレスポンスに乗せてブラウザに返す
        setAll: (cookiesToSet) => {
          ref.response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            ref.response.cookies.set(name, value, {
              ...options,
              ...COOKIE_OPTIONS,
            }),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !PUBLIC_PATH.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    ref.response = NextResponse.redirect(url)
  }
  return ref.response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
