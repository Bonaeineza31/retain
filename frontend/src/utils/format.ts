// 150000 -> "150,000 RWF"
export function formatRWF(amount: number): string {
  return amount.toLocaleString('en-US') + ' RWF'
}

// today as YYYY-MM-DD, in the user's own timezone
export function todayAsText(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

// this month as YYYY-MM
export function currentMonth(): string {
  return todayAsText().slice(0, 7)
}

// "2026-10" -> "October 2026"
export function formatMonth(month: string): string {
  const [year, number] = month.split('-').map(Number)
  return new Date(year, number - 1, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })
}

// "2026-10-14" -> "14 Oct 2026"
export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// "2026-10-19T06:51:16Z" -> "just now", "5 min ago", "3 h ago", "2 days ago", or the date
export function formatTimeAgo(isoTime: string): string {
  const minutes = Math.floor((Date.now() - new Date(isoTime).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return formatDate(isoTime.slice(0, 10))
}
