import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate()

  const logout = async () => {
    const check = window.confirm("Are you sure you want to log out?")
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
        <Link to="/#" className="nav-link custom-nav-link">Help</Link>
        <Link to="/user" className="nav-link custom-nav-link">User Info</Link>
        <Link to="/" className="nav-link custom-nav-link">All Decks</Link>
        <button
          className="btn custom-btn-blue text-white rounded-pill"
          onClick={logout}
         >
          Logout</button>
      </div>
    </nav>
  )
}

export default Header
