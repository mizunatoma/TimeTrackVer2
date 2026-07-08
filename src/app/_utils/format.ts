// 日本時刻のYYYY-MM-DDを返す
export const toJstParts = (date: Date) => {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

// 分数を 〇h 〇m に変換する
export const formatMinutes = (totalMinutes: number) => {
  const hour = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return mins !== 0 ? `${hour}h ${mins}m` : `${hour}h`
}
