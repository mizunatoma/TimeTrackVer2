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

      const demoLogs = [
        // 3日前
        { daysAgo: 3, start: '08:00', end: '09:30', activityId: tech.id },
        { daysAgo: 3, start: '10:00', end: '11:00', activityId: kakomon.id },
        { daysAgo: 3, start: '11:30', end: '12:30', activityId: tech.id },
        { daysAgo: 3, start: '13:00', end: '14:30', activityId: strategy.id },
        { daysAgo: 3, start: '15:00', end: '15:45', activityId: management.id },
        { daysAgo: 3, start: '16:30', end: '17:30', activityId: tech.id },
        { daysAgo: 3, start: '19:00', end: '20:30', activityId: kakomon.id },
        { daysAgo: 3, start: '21:00', end: '22:30', activityId: strategy.id },
        // 2日前
        { daysAgo: 2, start: '08:00', end: '09:00', activityId: kakomon.id },
        { daysAgo: 2, start: '09:30', end: '11:00', activityId: tech.id },
        { daysAgo: 2, start: '11:30', end: '12:15', activityId: management.id },
        { daysAgo: 2, start: '13:00', end: '14:30', activityId: tech.id },
        { daysAgo: 2, start: '15:00', end: '16:00', activityId: strategy.id },
        { daysAgo: 2, start: '16:30', end: '18:00', activityId: kakomon.id },
        { daysAgo: 2, start: '19:30', end: '20:30', activityId: tech.id },
        { daysAgo: 2, start: '21:00', end: '22:00', activityId: kakomon.id },
        // 前日
        { daysAgo: 1, start: '08:00', end: '09:00', activityId: strategy.id },
        { daysAgo: 1, start: '09:30', end: '10:30', activityId: tech.id },
        { daysAgo: 1, start: '11:00', end: '12:30', activityId: kakomon.id },
        { daysAgo: 1, start: '13:30', end: '14:30', activityId: management.id },
        { daysAgo: 1, start: '15:00', end: '16:30', activityId: tech.id },
        { daysAgo: 1, start: '17:00', end: '17:45', activityId: strategy.id },
        { daysAgo: 1, start: '19:00', end: '20:00', activityId: kakomon.id },
        { daysAgo: 1, start: '21:00', end: '22:30', activityId: tech.id },
        // 当日cron前
        { daysAgo: 0, start: '03:30', end: '04:20', activityId: kakomon.id },
        { daysAgo: 0, start: '04:30', end: '04:55', activityId: tech.id },
      ]
      await tx.timeLog.createMany({
        data: demoLogs.map((log) => ({
          activityId: log.activityId,
          startAt: jstDateTime(log.daysAgo, log.start),
          endAt: jstDateTime(log.daysAgo, log.end),
        })),
      })

      // 4. Todoデモ
      await tx.todoList.create({
        data: {
          profileId: guestProfileId,
          name: 'テクノロジ系',
          sortOrder: 0,
          todos: {
            create: [
              {
                title: 'P65~75',
                isDone: true,
                doneAt: jstDateTime(2, '22:30'),
              },
              { title: '頻出用語まとめ', isDone: false },
              { title: 'ネットワーク分野復習', isDone: false },
            ],
          },
        },
      })
      await tx.todoList.create({
        data: {
          profileId: guestProfileId,
          name: 'マネジメント系',
          sortOrder: 1,
          todos: {
            create: [
              {
                title: '3章 読了',
                isDone: true,
                doneAt: jstDateTime(1, '20:30'),
              },
              { title: '頻出用語まとめ', isDone: false },
            ],
          },
        },
      })
      await tx.todoList.create({
        data: {
          profileId: guestProfileId,
          name: 'ストラテジ系',
          sortOrder: 2,
          todos: {
            create: [
              { title: '頻出用語まとめ', isDone: false },
              { title: '財務諸表 5問', isDone: false },
            ],
          },
        },
      })
      await tx.todoList.create({
        data: {
          profileId: guestProfileId,
          name: '過去問演習',
          sortOrder: 3,
          todos: {
            create: [
              {
                title: '過去問30問',
                isDone: true,
                doneAt: jstDateTime(1, '22:30'),
              },
              { title: '模擬試験', isDone: false },
              { title: 'R7過去問', isDone: false },
            ],
          },
        },
      })
    })
  },
}
