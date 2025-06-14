import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Box, Button, Card, Container, FormControl, FormLabel, Link, TextField, Typography } from '@mui/material'

const SignInPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const user = {
      email,
      password
    }

    try {
      await axios.post(`${import.meta.env.VITE_API}/auth/login`, user, {withCredentials: true})
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
          Sign in
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleLogin}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
          >
            Sign in
          </Button>
        </Box>

        <Typography sx={{ textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Sign up
          </Link>
        </Typography>
      </Card>
    </Container>
  )
}

export default SignInPage
