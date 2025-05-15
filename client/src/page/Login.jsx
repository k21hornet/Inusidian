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
    <div className="container mt-5" style={{ maxWidth: '400px', fontFamily: "'Poppins', sans-serif" }}>
      <h2 className="mb-4 text-center">ログイン</h2>

      <div>
        <form onSubmit={login}>
          <div className="mb-3">
            <label className="form-label small">メールアドレス</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small">パスワード</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="mb-3 btn btn-primary custom-btn-blue w-100">ログイン</button>
        </form>

        <Link to={"/register"} className='custom-a-link'>アカウントをお持ちでない方はこちら</Link>
      </div>
    </div>
  )
}

export default Login
