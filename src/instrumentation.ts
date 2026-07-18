export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron')

    const { lineNotificationService } =
      await import('@/services/lineNotification.service') // 動的import
    cron.schedule(
      '0 21 * * *',
      () => lineNotificationService.learningRecordSummary(),
      { timezone: 'Asia/Tokyo' },
    )
    cron.schedule(
      '0 21 * * *',
      () => lineNotificationService.todoCompletionSummary(),
      { timezone: 'Asia/Tokyo' },
    )

    const { guestResetService } = await import('@/services/guestReset.service') // 動的import
    cron.schedule('0 5 * * *', () => guestResetService.reset(), {
      // seedと同様
      timezone: 'Asia/Tokyo',
    })
  }
}
