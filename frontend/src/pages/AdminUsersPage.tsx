import { useCallback } from 'react'
import AdminListFrame from '../components/AdminListFrame'
import AdminListRow from '../components/AdminListRow'
import AdminSearchBar from '../components/AdminSearchBar'
import usePagedList from '../hooks/usePagedList'
import { listUsers } from '../services/adminService'
import { setUsersPage, setUsersSearch } from '../store/adminListsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { formatDate, formatRWF } from '../utils/format'

// All registered users, a page at a time. Admins can search by name or email.
export default function AdminUsersPage() {
  const dispatch = useAppDispatch()
  const { search, page } = useAppSelector((state) => state.adminLists.users)

  const fetcher = useCallback(() => listUsers(search, page), [search, page])
  const { items: users, total, pageCount, loading, error } = usePagedList(fetcher)

  return (
    <AdminListFrame
      title="Registered users"
      summary={`${total} ${total === 1 ? 'user' : 'users'}${search ? ` matching "${search.trim()}"` : ''}`}
      searchBar={
        <AdminSearchBar
          label="Search by name or email"
          search={search}
          active={search !== ''}
          onSearch={(text) => dispatch(setUsersSearch(text))}
          onClear={() => dispatch(setUsersSearch(''))}
        />
      }
      error={error}
      loading={loading}
      emptyText={search ? 'No user matches your search.' : 'No users yet.'}
      page={page}
      pageCount={pageCount}
      onPageChange={(value) => dispatch(setUsersPage(value))}
    >
      {users.map((person) => (
        <AdminListRow
          key={person._id}
          title={person.name}
          details={person.email}
          caption={`Joined ${formatDate(person.createdAt.slice(0, 10))}`}
          amount={formatRWF(person.totalSpent)}
          amountNote={`${person.expenseCount} ${person.expenseCount === 1 ? 'expense' : 'expenses'}`}
        />
      ))}
    </AdminListFrame>
  )
}
