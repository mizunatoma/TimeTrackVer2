import { JWT_COOKIE_OPTIONS, signJWT } from '@/app/_lib/jwt'
import { userRepository } from '@/repositories/user.repository'
import type { User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

export const authService = {
  // 新規ユーザー登録
  async createUser(passwordHash: string, email: string) {
    const user = await userRepository.create(passwordHash, email)
    return user
  },
  // passwordHashを更新して、ユーザ情報を更新
  async updateUser(passwordHash: string, email: string) {
    const user = await userRepository.updatePassword(passwordHash, email)
    return user
  },
  // bcryptjs でパスワードをハッシュ化
  async createPasswordHash(password: string) {
    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(password, salt)
    return passwordHash
  },
  // bcryptjs でパスワードを照合
  async verifyPassword(password: string, passwordHash: string) {
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
    const user = await userRepository.findByEmail(email)
    return user
  },
  // 現在のユーザ情報を Controller へ
  async findResetUser(token: string) {
    const user = await userRepository.findByResetToken(token)
    return user
  },
  // ゲストログイン情報を Controller へ
  async findGuestUser() {
    const user = await userRepository.guest()
    return user
  },
  // パスワードリセットのための、ランダムtokenを生成し、有効期限をDBへ
  async resetPassword(email: string) {
    const token = crypto.randomUUID()
    await userRepository.resetPassword(email, token)
    return token
  },
  // reset password のメールを送信
  async sendResetPasswordMail(user: User, resetToken: string) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?token=${resetToken}`
    const sendMail = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'OneTrack パスワードリセット',
      html: `パスワードリセットはこちら: ${resetUrl}`,
    })
    return sendMail
  },
}
