import { prisma } from '@/app/_utils/prisma'

export const userRepository = {
  async create(passwordHash: string, email: string) {
    const user = await prisma.user.create({
      data: { passwordHash, email },
    })
    return user
  },

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user
  },

  async findByResetToken(resetToken: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken,
        expirationDate: { gt: new Date() }, // 有効期限内のみ取得
      },
    })
    return user
  },

  async guest() {
    const guestUser = await prisma.user.findUnique({
      where: { email: process.env.GUEST_EMAIL! },
    })
    return guestUser
  },

  async resetPassword(email: string, resetToken: string) {
    const user = await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        expirationDate: new Date(Date.now() + 60 * 60 * 1000), // 1h
      },
    })
    return user
  },

  async updatePassword(passwordHash: string, email: string) {
    const user = await prisma.user.update({
      where: { email },
      data: { passwordHash, resetToken: null, expirationDate: null }, // resetToken初期化(使い捨て)
    })
    return user
  },
}
