export const getTodaysDate = () => new Date().toISOString().split('T')[0]

export const getTimeToNearest30 = () => {
  const now = new Date()
  const ms = 1000 * 60 * 30
  const roundedDate = new Date(Math.round(now.getTime() / ms) * ms)
  const minutes = `${roundedDate.getMinutes()}`.padStart(2, '0')
  const hours = `${now.getHours()}`

  return `${hours}:${minutes}`.padStart(5, '0')
}
