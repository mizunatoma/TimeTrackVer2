import { formatMinutes, formatTime } from '@/app/_utils/format'
import { pushTextMessage } from '@/lib/line'
import { profileRepository } from '@/repositories/profile.repository'
import { todoItemRepository } from '@/repositories/todo.repository'
import { Todo } from '@prisma/client'
import { analyticsService } from './analytics.service'

export const lineNotificationService = {
  async learningRecordSummary() {
    //   1. findAllLineLinked() でLINE連携済みProfile一覧を取る
    const profiles = await profileRepository.findAllLineLinked()
    const userIds = profiles.map((profile) => profile.userId)

    //   2. 今日の日付文字列（'YYYY-MM-DD'）を作る
    const date = new Date().toLocaleDateString('sv-SE', {
      timeZone: 'Asia/Tokyo',
    })

    // 全ユーザー分を1クエリで取得＋userIdごとに集計済み（N+1回避）
    const analyticsByUser = await analyticsService.getAnalyticsByUsers(
      userIds,
      date,
      date,
    )

    //   3-b. テキストを組み立てる
    for (const profile of profiles) {
      if (!profile.lineUserId) continue // Narrowing
      const byCategory = analyticsByUser[profile.userId] ?? []
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
    const userIds = profiles.map((profile) => profile.userId)

    const allCompletedTodos =
      await todoItemRepository.findTodosCompletedTodayByUsers(userIds)

    const todosByUser: Record<string, Todo[]> = {} // キーがstring（userId）、値がTodoの配列

    for (const todo of allCompletedTodos) {
      const userId = todo.todoList.profile.userId

      if (!todosByUser[userId]) {
        todosByUser[userId] = [] // 初回なら空配列を作る
      }
      todosByUser[userId].push(todo) // userId ごとの配列に todo を振り分ける
    }

    for (const profile of profiles) {
      if (!profile.lineUserId) continue
      const todosCompletedToday = todosByUser[profile.userId] ?? []
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
