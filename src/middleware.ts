import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "./app/_lib/jwt";

export const middleware = async (request: NextRequest) => {
  // ホワイトリスト（認証不要）
  const PUBLIC_PATH = [
    '/signup', 
    '/api/auth/signup', 
    '/signin',
    '/api/auth/signin', 
    '/reset-password', 
    '/api/auth/reset-password', 
    '/api/auth/callback', 
    '/update-password', 
    '/api/auth/update-password', 
    '/api/auth/guest'
  ]
  
  // 公開パスはそのまま通す(早期リターン)
  const isPublic = PUBLIC_PATH.some((path) => request.nextUrl.pathname.startsWith(path))
  if (isPublic) return NextResponse.next({ request })

  const token = request.cookies.get('jwt')
  // token がなければ /login へリダイレクト
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // tokenを検証してリダイレクト
  try {
    await jwtVerify(token.value)
    return NextResponse.next({ request })
  } catch {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}