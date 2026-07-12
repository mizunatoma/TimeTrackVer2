// 日本時刻のYYYY-MM-DDを返す
export const toJstParts = (date: Date) => {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

// 分数を 〇h 〇m に変換する
export const formatMinutes = (totalMinutes: number) => {
  const hour = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (hour === 0) return `${mins}m`
  return mins !== 0 ? `${hour}h ${mins}m` : `${hour}h`
}

// 例：「Wed Jul 08 2026 18:06:29 GMT+0900 (日本標準時)」→ 「18:06」
export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
