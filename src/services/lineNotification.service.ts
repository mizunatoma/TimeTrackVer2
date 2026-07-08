import { formatMinutes, formatTime } from '@/app/_utils/format'
import { pushTextMessage } from '@/lib/line'
import { profileRepository } from '@/repositories/profile.repository'
import { todoItemRepository } from '@/repositories/todo.repository'
import { analyticsService } from './analytics.service'

export const lineNotificationService = {
  async learningRecordSummary() {
    //   1. findAllLineLinked() でLINE連携済みProfile一覧を取る
    const profiles = await profileRepository.findAllLineLinked()
    //   2. 今日の日付文字列（'YYYY-MM-DD'）を作る
    const date = new Date().toLocaleDateString('sv-SE', {
      timeZone: 'Asia/Tokyo',
    })
    //   3-a. getAnalytics(userId, 今日, 今日) で集計済みデータを取る
    for (const profile of profiles) {
      if (!profile.lineUserId) continue // Narrowing
      const byCategory = await analyticsService.getAnalytics(
        profile.userId,
        date,
        date,
      )
      //   3-b. テキストを組み立てる
      const text =
        byCategory.length !== 0
          ? '📊 今日の学習記録\n' +
            byCategory
              .map((b) => `${b.name}: ${formatMinutes(b.totalMinutes)}`)
              .join('\n')
          : '記録なし'
      //   3-c. pushTextMessage で送る
      await pushTextMessage(profile.lineUserId, text)
    }
  },

  async todoCompletionSummary() {
    const profiles = await profileRepository.findAllLineLinked()

    for (const profile of profiles) {
      if (!profile.lineUserId) continue // Narrowing

      const todosCompletedToday =
        await todoItemRepository.findTodosCompletedToday(profile.userId)

      if (todosCompletedToday.length !== 0) {
        const text =
          '🚩 今日達成したTodo\n' +
          todosCompletedToday
            .map((todo) => `✅ ${todo.title} (${formatTime(todo.doneAt!)})`)
            .join('\n')
        await pushTextMessage(profile.lineUserId, text)
      }
    }
  },
}
