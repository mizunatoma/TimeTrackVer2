import { prisma } from '@/app/_utils/prisma'

export const lineLinkTokenRepository = {
  async findByToken(token: string) {
    const lineLinkToken = await prisma.lineLinkToken.findUnique({
      where: { token },
      select: {
        expireAt: true,
        profileId: true,
      },
    })
    return lineLinkToken
  },
  async upsert(profileId: string, token: string, expireAt: Date) {
    await prisma.lineLinkToken.upsert({
      where: { profileId },
      create: { profileId, token, expireAt },
      update: { token, expireAt },
    })
  },
  async delete(token: string) {
    await prisma.lineLinkToken.delete({
      where: { token },
    })
  },
}
