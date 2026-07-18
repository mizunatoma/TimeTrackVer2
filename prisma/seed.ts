import bcrypt from 'bcryptjs'
import 'dotenv/config'
import { prisma } from '../src/app/_utils/prisma'
import { guestRepository } from '../src/repositories/guest.repository'

async function main() {
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(process.env.GUEST_PASSWORD!, salt)

  // ゲストUserの作成（既存なら維持）
  const guest = await prisma.user.upsert({
    where: { email: process.env.GUEST_EMAIL },
    update: {},
    create: {
      email: process.env.GUEST_EMAIL!,
      passwordHash,
    },
  })
  console.log({ guest })

  // Profile初期化＋デモデータ再作成（cronと同様）
  await guestRepository.resetGuestData(guest.id)
  console.log('デモデータをリセットしました')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
