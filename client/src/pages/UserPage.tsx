import { useEffect, useState } from 'react'
import { useUser } from '../contexts/UserContext'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import BaseLayout from '../components/layout/BaseLayout'
import { Box, Button, FormControl, FormLabel, Modal, TextField, Typography } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  width: 500
}

const UserPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  
  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const navigate = useNavigate()

  useEffect(() => {
    setUserInfo()
  },[])
  
  const { user, setUser } = useUser()
  if (!user) return <Navigate to="/signin" />

  const setUserInfo = () => {
    setUsername(user.username)
    setEmail(user.email)
  }

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const updateUser = {
      id: user.id,
      username,
      email
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/user/update`, updateUser, {withCredentials: true})
      alert("User Update Success!")
      if (res.data) {
        navigate("/signin")
      }
    } catch (e) {
      console.log(e)      
    }
  }

  const updatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const updateUser = {
      id: user.id,
      oldPassword,
      newPassword,
      newPasswordConfirm
    }
    try {
      await axios.post(`${import.meta.env.VITE_API}/user/pass`, updateUser, {withCredentials: true})
      alert("Password Update Success!")
      const res = await axios.get(`${import.meta.env.VITE_API}/auth/me`, { withCredentials: true })   
      setUser(res.data)
      closeModal()
    } catch (e) {
      console.log(e)      
    }
  }

  return (
    <BaseLayout>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 4
        }}
      >
        <Typography variant='h4'>User Info</Typography>

        <Box sx={{ width: 400}}>
          <Box 
          component="form" 
          onSubmit={update}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}>
            <FormControl>
              <FormLabel htmlFor='username'>Username</FormLabel>
                <TextField
                  id='username'
                  type='text'
                  name='username'
                  placeholder="smith2025"
                  required
                  value={username}
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  fullWidth
                />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='email'>Email</FormLabel>
                <TextField
                  id='email'
                  type='email'
                  name='email'
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  fullWidth
                />
            </FormControl>

            <Button
              type='submit'
              variant="contained"
              fullWidth
            >Update User Info</Button>

            <Button
              onClick={openModal}
              variant="contained"
              fullWidth
            >Update Password</Button>
          </Box>
        </Box>

      </Box>

      <Modal
        open={showModal}
        onClose={closeModal}
      >
        <Box sx={style}>
          <Typography variant='h5'>Update Password</Typography>

          <Box 
            component="form" 
            onSubmit={updatePassword}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >

            <FormControl>
              <FormLabel htmlFor='old-password'>Old Password</FormLabel>
                <TextField
                  id='old-password'
                  type='password'
                  name='oldPassword'
                  placeholder="••••••"
                  required
                  value={oldPassword}
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setOldPassword(e.target.value)}
                  fullWidth
                />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='new-password'>New Password</FormLabel>
                <TextField
                  id='new-password'
                  type='password'
                  name='newPassword'
                  placeholder="••••••"
                  required
                  value={newPassword}
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                  fullWidth
                />
            </FormControl>
  
            <FormControl>
              <FormLabel htmlFor='new-password-confirm'>New Password Confirm</FormLabel>
                <TextField
                  id='new-password-confirm'
                  type='password'
                  name='newPasswordConfirm'
                  placeholder="••••••"
                  required
                  value={newPasswordConfirm}
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setNewPasswordConfirm(e.target.value)}
                  fullWidth
                />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

    </BaseLayout>
  )
}

export default UserPage
