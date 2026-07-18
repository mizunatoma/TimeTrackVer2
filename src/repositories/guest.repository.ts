import { prisma } from '@/app/_utils/prisma'

// 「n日前のJST hh:mm」のDateを作る
const jstDateTime = (daysAgo: number, time: string) => {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
  const dateStr = d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' })
  return new Date(`${dateStr}T${time}:00+09:00`)
}

export const guestRepository = {
  async resetGuestData(guestId: string) {
    await prisma.$transaction(async (tx) => {
      // 1. ゲストのprofileを初期化
      const guestProfile = await tx.profile.upsert({
        where: { userId: guestId },
        update: { displayName: 'ゲストユーザー', lineUserId: null },
        create: { userId: guestId, displayName: 'ゲストユーザー' },
      })
      const guestProfileId = guestProfile.id

      // 2. デモデータをクリア (FK制約があるため子→親の順で削除)
      await tx.timeLog.deleteMany({
        where: { activity: { profileId: guestProfileId } },
      })
      await tx.activity.deleteMany({ where: { profileId: guestProfileId } })
      await tx.todo.deleteMany({
        where: { todoList: { profileId: guestProfileId } },
      })
      await tx.todoList.deleteMany({ where: { profileId: guestProfileId } })
      await tx.lineLinkToken.deleteMany({
        where: { profileId: guestProfileId },
      })

      // 3. デモデータ再作成
      const tech = await tx.activity.create({
        data: {
          name: 'テクノロジ系',
          colorToken: 'bg-sky-400/60',
          profileId: guestProfileId,
        },
      })
      const management = await tx.activity.create({
        data: {
          name: 'マネジメント系',
          colorToken: 'bg-amber-400/60',
          profileId: guestProfileId,
        },
      })
      const strategy = await tx.activity.create({
        data: {
          name: 'ストラテジ系',
          colorToken: 'bg-green-400/60',
          profileId: guestProfileId,
        },
      })
      const kakomon = await tx.activity.create({
        data: {
          name: '過去問演習',
          colorToken: 'bg-rose-400/60',
          profileId: guestProfileId,
        },
      })

      await tx.timeLog.createMany({
        data: [
          // 3日前
          {
            activityId: tech.id,
            startAt: jstDateTime(3, '06:00'),
            endAt: jstDateTime(3, '06:45'),
          },
          {
            activityId: kakomon.id,
            startAt: jstDateTime(3, '21:00'),
            endAt: jstDateTime(3, '22:00'),
          },
          // 2日前
          {
            activityId: strategy.id,
            startAt: jstDateTime(2, '06:00'),
            endAt: jstDateTime(2, '06:30'),
          },
          {
            activityId: management.id,
            startAt: jstDateTime(2, '12:15'),
            endAt: jstDateTime(2, '12:45'),
          },
          {
            activityId: algorithm.id,
            startAt: jstDateTime(2, '21:30'),
            endAt: jstDateTime(2, '22:30'),
          },
          // 前日
          {
            activityId: tech.id,
            startAt: jstDateTime(1, '06:00'),
            endAt: jstDateTime(1, '06:45'),
          },
          {
            activityId: algorithm.id,
            startAt: jstDateTime(1, '21:00'),
            endAt: jstDateTime(1, '21:45'),
          },
          {
            activityId: kakomon.id,
            startAt: jstDateTime(1, '22:00'),
            endAt: jstDateTime(1, '22:30'),
          },
        ],
      })

      // 4. Todoデモ
      await tx.todoList.create({
        data: {
          profileId: guestProfileId,
          name: '今週',
          sortOrder: 0,
          todos: {
            create: [
              {
                title: '過去問30問 解き直し',
                isDone: true,
                doneAt: jstDateTime(1, '22:30'),
              },
              {
                title: 'テクノロジ系 P65~75',
                isDone: true,
                doneAt: jstDateTime(2, '22:30'),
              },
              { title: 'アルゴリズム 第3章', isDone: false },
              { title: '模擬試験予約', isDone: false },
            ],
          },
        },
      })
    })
  },
}
