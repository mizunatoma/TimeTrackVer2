import { lineLinkTokenRepository } from '@/repositories/lineLinkToken.repository'
import { profileRepository } from '@/repositories/profile.repository'

type LineWebhookEvent = {
  type: string
  message?: { type: string; text: string }
  source?: { userId?: string }
}

export const lineLinkTokenService = {
  async handleEvents(events: LineWebhookEvent[]) {
    for (const event of events) {
      // 1. テキストメッセージ以外はスキップ
      if (event.type !== 'message' || event.message?.type !== 'text') continue

      const lineUserId = event.source?.userId
      if (!lineUserId) continue

      // 2. トークン照合
      const record = await lineLinkTokenRepository.findByToken(
        event.message.text,
      )

      // 3-a. 見つからない → 雑談メッセージなのでスキップ
      if (!record) continue

      // 3-b. 期限切れ → 掃除して終わり
      if (record.expireAt < new Date()) {
        await lineLinkTokenRepository.delete(event.message.text)
        continue
      }

      // 3-c. 有効 → 連携成立、トークンは使い捨て
      await profileRepository.updateLineUserId(record.profileId, lineUserId)
      await lineLinkTokenRepository.delete(event.message.text)
    }
  },
}
