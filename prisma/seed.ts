import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const salt = bcrypt.genSaltSync(10)
  const passwordHash = bcrypt.hashSync(process.env.GUEST_PASSWORD!, salt)

  const guest = await prisma.user.upsert({
    where: { email: process.env.GUEST_EMAIL },
    update: {},
    create: {
      email: process.env.GUEST_EMAIL!,
      passwordHash,
    },
  })
  console.log({ guest })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
