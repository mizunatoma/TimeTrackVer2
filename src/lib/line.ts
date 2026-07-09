import { logger } from './logger'

export const pushTextMessage = async (lineUserId: string, text: string) => {
  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: lineUserId,
      messages: [{ type: 'text', text }],
    }),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    logger.error('LINE push failed', { status: res.status, errorBody })
  }
}
