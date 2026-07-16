import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

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

  const profile = await prisma.profile.upsert({
    where: { userId: guest.id },
    update: {},
    create: {
      userId: guest.id,
      displayName: 'ゲストユーザー',
    },
  })
  console.log({ profile })

  // デモactivities
  if (
    await prisma.activity.findFirst({
      where: { profileId: profile.id, deletedAt: null },
    })
  )
    return

  const activity1 = await prisma.activity.create({
    data: {
      name: '国語',
      colorToken: 'bg-rose-400/60',
      profileId: profile.id,
    },
  })
  const activity2 = await prisma.activity.create({
    data: {
      name: '算数',
      colorToken: 'bg-sky-400/60',
      profileId: profile.id,
    },
  })
  const activity3 = await prisma.activity.create({
    data: {
      name: '英語',
      colorToken: 'bg-purple-400/60',
      profileId: profile.id,
    },
  })
  console.log({ activity1, activity2, activity3 })

  // デモlogs
  const timeLogs = await prisma.timeLog.createMany({
    data: [
      // 国語
      {
        activityId: activity1.id,
        startAt: new Date('2026-07-11T09:00:00+09:00'),
        endAt: new Date('2026-07-11T10:30:00+09:00'),
      },
      {
        activityId: activity1.id,
        startAt: new Date('2026-07-12T20:00:00+09:00'),
        endAt: new Date('2026-07-12T21:00:00+09:00'),
      },
      // 算数
      {
        activityId: activity2.id,
        startAt: new Date('2026-07-11T14:00:00+09:00'),
        endAt: new Date('2026-07-11T15:00:00+09:00'),
      },
      {
        activityId: activity2.id,
        startAt: new Date('2026-07-13T10:00:00+09:00'),
        endAt: new Date('2026-07-13T11:30:00+09:00'),
      },
      // 英語
      {
        activityId: activity3.id,
        startAt: new Date('2026-07-12T09:00:00+09:00'),
        endAt: new Date('2026-07-12T09:45:00+09:00'),
      },
      {
        activityId: activity3.id,
        startAt: new Date('2026-07-13T21:00:00+09:00'),
        endAt: new Date('2026-07-13T22:00:00+09:00'),
      },
    ],
  })
  console.log({ timeLogs }) // ← createManyは { count: 6 } しか出ない
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
