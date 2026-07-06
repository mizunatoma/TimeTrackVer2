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
  async delete(token: string) {
    await prisma.lineLinkToken.delete({
      where: { token },
    })
  },
}
