// DBに繋ぐクライアント
// 使用先：全 route.ts

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
})

export const prisma = new PrismaClient({ adapter })
