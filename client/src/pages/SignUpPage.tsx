import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Box, Button, Card, Container, FormControl, FormLabel, Link, TextField, Typography } from '@mui/material'

const SignUpPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const user = {
      username,
      email,
      password,
      passwordConfirm
    }
    try {
      await axios.post(`${import.meta.env.VITE_API}/auth/register`, user, {withCredentials: true})
      const res = await axios.get(`${import.meta.env.VITE_API}/auth/me`, { withCredentials: true })   
      setUser(res.data)
      navigate('/')
    } catch (e) {
      console.log(e)      
    }
  }
  
  return (
    <Container maxWidth="sm">
      <Card sx={{ padding: 4, marginTop: 16 }}>
        <Typography
          variant='h4'
        >
          Sign up
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleRegister}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
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

          <FormControl>
            <FormLabel htmlFor='password'>Password</FormLabel>
              <TextField
                id='password'
                type='password'
                name='password'
                placeholder="••••••"
                required
                value={password}
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                fullWidth
              />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='password-confirm'>Password Confirm</FormLabel>
              <TextField
                id='password-confirm'
                type='password'
                name='passwordConfirm'
                placeholder="••••••"
                required
                value={passwordConfirm}
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)}
                fullWidth
              />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
          >
            Sign up
          </Button>
        </Box>

        <Typography sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Link
            href="/signin"
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Sign in
          </Link>
        </Typography>
      </Card>
    </Container>
  )
}

export default SignUpPage
