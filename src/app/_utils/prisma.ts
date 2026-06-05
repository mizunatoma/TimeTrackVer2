// DBに繋ぐクライアント
// 使用先：全 route.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
