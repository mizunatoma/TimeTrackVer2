import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from './app/_lib/jwt'

// ホワイト(ログイン不要)リスト定義
const PUBLIC_PATH = ['/login', '/signup', '/api/auth/guest']

export const middleware = async (request: NextRequest) => {
  const isPublic = PUBLIC_PATH.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  // 公開パスはそのまま通す(早期リターン)
  if (isPublic) return NextResponse.next({ request })

  const token = await request.cookies.get('jwt')
  // トークンがなければ /login へリダイレクト
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  try {
    await jwtVerify(token.value)
    return NextResponse.next({ request })
  } catch {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  } 
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
