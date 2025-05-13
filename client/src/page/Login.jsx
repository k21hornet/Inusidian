import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { setUser } = useUser()

  const login = async (e) => {
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
    <div>
      <h1>ログイン</h1>

      <div>
        <form onSubmit={login}>
          <div>
            <label>メールアドレス</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>パスワード</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">ログイン</button>
        </form>

        <Link to={"/register"}>アカウントをお持ちでない方はこちら</Link>
      </div>
    </div>
  )
}

export default Login
