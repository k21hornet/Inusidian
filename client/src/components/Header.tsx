import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const logout = async () => {
    const check = window.confirm("Are you sure you want to log out?")
    if (!check) return

    try {
      await axios.post(`${import.meta.env.VITE_API}/auth/logout`,{}, { withCredentials: true })
      navigate('/signin')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <AppBar position='static'>
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant='h5'
            sx={{ flexGrow: 1, fontWeight: 600 }}
            onClick={() => navigate("/")}
          >INUSIDIAN</Typography>

          <Box sx={{ flexGrow: 0 }}>
            <NotificationsNoneIcon />

            <Tooltip title="Open settings">
              <IconButton onClick={e => setDropdownOpen(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar alt="Ikemen" src={import.meta.env.VITE_LINK + "/ikemen.png"} />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              anchorEl={dropdownOpen}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(dropdownOpen)}
              onClose={() => setDropdownOpen(null)}
            >
              <MenuItem>
                <Link to={"/user"}>
                  <Typography sx={{ textAlign: 'center' }}>Profile</Typography>
                </Link>
              </MenuItem>
              <MenuItem onClick={logout}>
                <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
