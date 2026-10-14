import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'

// the admin pages share a title and two tabs
export default function AdminLayout() {
  const location = useLocation()

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Admin
      </Typography>

      <Tabs
        value={location.pathname}
        indicatorColor="secondary"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons={false}
      >
        <Tab label="Insights" value="/admin" component={RouterLink} to="/admin" />
        <Tab label="Categories" value="/admin/categories" component={RouterLink} to="/admin/categories" />
      </Tabs>

      <Outlet />
    </Box>
  )
}
