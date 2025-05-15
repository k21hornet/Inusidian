import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate()

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
    <nav className="w-100 navbar navbar-expand-lg custom-navbar px-5 py-2 shadow bg-white">
      <div>
        <Link to="/" className="navbar-brand fs-4">INUSIDIAN</Link>
      </div>

      <div className="ms-auto d-flex align-items-center gap-3">
        <Link to="/user" className="nav-link custom-nav-link">ユーザー情報</Link>
        <Link to="/" className="nav-link custom-nav-link">デッキ一覧</Link>
        <button
          className="btn custom-btn-blue text-white rounded-pill"
          onClick={logout}
         >
          ログアウト</button>
      </div>
    </nav>
  )
}

export default Header
