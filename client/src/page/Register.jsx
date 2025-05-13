import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const navigate = useNavigate()
  const { setUser } = useUser()

  const register = async (e) => {
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
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h1 className="mb-4 text-center">新規登録</h1>

      <div>
        <form onSubmit={register}>
          <div className="mb-3">
            <label className="form-label">ユーザー名</label>
            <input
              type="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">メールアドレス</label>
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
            <label className="form-label">パスワード</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">パスワード確認用</label>
            <input
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <button type="submit" className="mb-3 btn btn-primary w-100">アカウント登録</button>
        </form>

        <Link to={"/login"}>アカウントをお持ちの方はこちら</Link>
      </div>
    </div>
  )
}

export default Register
