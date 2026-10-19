import AddOutlined from '@mui/icons-material/AddOutlined'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import Snackbar from '@mui/material/Snackbar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ExpenseForm from './ExpenseForm'
import Logo from './Logo'
import NotificationBell from './NotificationBell'
import Sidebar from './Sidebar'
import useAuth from '../hooks/useAuth'
import { listCategories } from '../services/categoryService'
import { resetFilters } from '../store/expenseFiltersSlice'
import { useAppDispatch } from '../store/hooks'
import type { Category } from '../types/category'
import { formatDate, todayAsText } from '../utils/format'

const SIDEBAR_WIDTH = 250

function getPageTitle(pathname: string) {
  if (pathname.startsWith('/expenses/')) return 'Expense details'
  if (pathname === '/expenses') return 'Expenses'
  if (pathname === '/budget') return 'Budget'
  if (pathname === '/admin/categories') return 'Categories'
  if (pathname === '/admin/users') return 'Users'
  if (pathname === '/admin/expenses') return 'All expenses'
  if (pathname.startsWith('/admin')) return 'Insights'
  return 'Dashboard'
}

// The frame around every signed in page: the menu, the top bar and the page itself.
export default function AppLayout() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const [menuOpen, setMenuOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [toastMessage, setToastMessage] = useState('')
  // changing this number makes the page load its data again
  const [pageKey, setPageKey] = useState(0)

  async function handleSignOut() {
    dispatch(resetFilters())
    await signOut()
    navigate('/signin')
  }

  function handleOpenAdd() {
    listCategories().then(setCategories).catch(() => {})
    setAddOpen(true)
  }

  function handleSaved(message: string) {
    setAddOpen(false)
    setToastMessage(message)
    setPageKey((key) => key + 1)
  }

  const sidebar = (
    <Sidebar
      userName={user?.name}
      isAdmin={isAdmin}
      onAddExpense={handleOpenAdd}
      onSignOut={handleSignOut}
      onClose={() => setMenuOpen(false)}
    />
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* the menu stays on the left on big screens */}
      <Box component="nav" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 }, display: { xs: 'none', md: 'block' } }}>
        <Box
          sx={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: SIDEBAR_WIDTH, borderRight: 1, borderColor: 'divider', zIndex: 1100 }}
        >
          {sidebar}
        </Box>
      </Box>

      {/* on phones it slides in */}
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: SIDEBAR_WIDTH },
        }}
      >
        {sidebar}
      </Drawer>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" color="inherit" sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar sx={{ gap: 2, px: { xs: 2, sm: 3 }, minHeight: { xs: 56, sm: 60 } }}>
            <Button variant="outlined" size="small" onClick={() => setMenuOpen(true)} sx={{ display: { md: 'none' } }}>
              Menu
            </Button>

            <Box
              component={RouterLink}
              to="/dashboard"
              sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, textDecoration: 'none' }}
            >
              <Logo size={28} />
              <Typography variant="h6" sx={{ color: 'primary.dark' }}>
                Retain
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                {getPageTitle(location.pathname)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Today: {formatDate(todayAsText())}
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* on big screens the menu already has this button */}
            <Button
              variant="contained"
              size="small"
              startIcon={<AddOutlined />}
              onClick={handleOpenAdd}
              sx={{ display: { xs: 'none', sm: 'inline-flex', md: 'none' } }}
            >
              Add expense
            </Button>

            <NotificationBell />
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Container maxWidth="lg" disableGutters>
            <Outlet key={pageKey} />
          </Container>
        </Box>
      </Box>

      {addOpen && <ExpenseForm categories={categories} onClose={() => setAddOpen(false)} onSaved={handleSaved} />}

      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={toastMessage !== ''} autoHideDuration={3000} onClose={() => setToastMessage('')} message={toastMessage} />
    </Box>
  )
}
