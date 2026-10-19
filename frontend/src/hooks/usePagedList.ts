import { useEffect, useState } from 'react'
import { getErrorMessage } from '../utils/errors'

// one page of a list, plus how many there are in total
interface PagedResult<T> {
  items: T[]
  total: number
  pageSize: number
}

// Loads one page of a list. It loads again whenever the fetcher changes, so give it a fetcher
// made with useCallback that depends on the search and the page.
export default function usePagedList<T>(fetcher: () => Promise<PagedResult<T>>) {
  const [loaded, setLoaded] = useState<{ fetcher: typeof fetcher; data: PagedResult<T> } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // when the admin changes the page quickly, an old answer must not replace a newer one
    let outdated = false

    fetcher()
      .then((data) => {
        if (outdated) return
        setLoaded({ fetcher, data })
        setError('')
      })
      .catch((err: unknown) => {
        if (!outdated) setError(getErrorMessage(err))
      })

    return () => {
      outdated = true
    }
  }, [fetcher])

  const total = loaded?.data.total ?? 0
  const pageSize = loaded?.data.pageSize ?? 10

  return {
    items: loaded?.data.items ?? [],
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    // true until the answer for the current search and page has arrived
    loading: !error && loaded?.fetcher !== fetcher,
    error,
  }
}
