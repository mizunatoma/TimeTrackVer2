import * as jose from 'jose'

// signJWT(userId) → JWTを作って返す関数
export async function signJWT(userId: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const alg = 'HS256'
  const jwt = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('24h')
    .sign(secret)
  return jwt
}

// verifyJWT(token) → JWTを検証して中身を返す関数
export async function jwtVerify(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const { payload } = await jose.jwtVerify(token, secret, {
    issuer: 'urn:example:issuer',
    audience: 'urn:example:audience',
  })
  return { payload }
}
