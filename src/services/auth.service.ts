import { JWT_COOKIE_OPTIONS, signJWT } from "@/app/_lib/jwt"
import { userRepository } from "@/repositories/user.repository"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export const authService  = {
  // bcryptjs でパスワードをハッシュ化
  async createPasswordHash(password: string, email:string) {
    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)
    const newUser = await userRepository.create(passwordHash, email)
    return newUser;
  },
  // bcryptjs でパスワードを照合
  async verifyPassword(password: string, passwordHash:string) {
    const isMatch = bcrypt.compareSync(password, passwordHash)
    return isMatch
  },
  // jose で JWTトークンを発行して Cookie にセット
  async issueToken(userId: string) {
    const jwt = await signJWT(userId)
    const cookieStore = await cookies()
    cookieStore.set('jwt', jwt, { ...JWT_COOKIE_OPTIONS })
    return jwt
  },
  // Cookie のJWTトークンを削除
  async deleteToken() {
    const cookieStore = await cookies()
    cookieStore.delete('jwt')
  },
  // 現在のユーザ情報を Controller へ
  async findUser(email: string) {
    const currentUser = await userRepository.findByEmail(email)
    return currentUser
  },
  // ゲストログイン情報を Controller へ
  async findGuestUser() {
    const currentUser = await userRepository.guest()
    return currentUser
  },
}