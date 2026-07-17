import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from './app/_lib/jwt'

export const middleware = async (request: NextRequest) => {
  // ホワイトリスト（認証不要）
  const PUBLIC_PATH = [
    '/',
    '/signup',
    '/signin',
    '/reset-password',
    '/update-password',

    '/api/auth/signup',
    '/api/auth/signin',
    '/api/auth/reset-password',
    '/api/auth/callback',
    '/api/auth/update-password',
    '/api/auth/guest',
    '/api/line/webhook',
  ]

  const isPublic = PUBLIC_PATH.some((path) => request.nextUrl.pathname === path)
  if (isPublic) return NextResponse.next({ request }) // 公開パスはそのまま通す

  const isApi = request.nextUrl.pathname.startsWith('/api')
  const token = request.cookies.get('jwt')

  // token がなく、APIなら401、画面ならリダイレクト
  if (!token) {
    if (isApi) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    } else {
      const url = request.nextUrl.clone()
      url.pathname = '/signin'
      return NextResponse.redirect(url)
    }
  }

  // tokenを検証し、APIなら401、画面ならリダイレクト
  try {
    await jwtVerify(token.value)
    return NextResponse.next({ request })
  } catch {
    if (isApi) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    } else {
      const url = request.nextUrl.clone()
      url.pathname = '/signin'
      return NextResponse.redirect(url)
    }
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
