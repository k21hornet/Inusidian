import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useUser()

  const logout = async () => {
    const check = window.confirm("ログアウトしますか？")
    if (!check) return

    try {
      await axios.post(`${import.meta.env.VITE_API}/auth/logout`,{}, { withCredentials: true })
      navigate('/login')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <h1>ユーザー：{user?.username}</h1>
      <button onClick={logout}>ログアウト</button>
    </div>
  )
}

export default Home
