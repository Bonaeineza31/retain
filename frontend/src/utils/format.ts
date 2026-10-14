// 150000 -> "150,000 RWF"
export function formatRWF(amount: number): string {
  return amount.toLocaleString('en-US') + ' RWF'
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
