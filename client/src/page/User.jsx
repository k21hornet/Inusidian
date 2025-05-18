import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useUser } from '../contexts/UserContext'
import axios from 'axios'

const User = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const { user, setUser } = useUser()

  const update = async (e) => {
    e.preventDefault()

    const updateUser = {
      id: user.id,
      username,
      email
    }
    try {
      await axios.post(`${import.meta.env.VITE_API}/user/update`, updateUser, {withCredentials: true})
      alert("User Update Success!")
      const res = await axios.get(`${import.meta.env.VITE_API}/auth/me`, { withCredentials: true })   
      setUser(res.data)
    } catch (e) {
      console.log(e)      
    }
  }

  useEffect(() => {
    setUsername(user.username)
    setEmail(user.email)
  },[])

  return (
    <div>
      <div className='bg-light min-vh-100 w-100 d-flex flex-column align-items-center overflow-hidden'>
      <Header />

      <div className='m-4 w-75' style={{ maxWidth: '400px' }}>
        <h2 className="mb-4 text-center">UserInfo</h2>

        <form onSubmit={update}>
          <div className="mb-3">
            <label className="form-label small">ユーザー名</label>
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

          <button type="submit" className="mb-3 btn btn-primary custom-btn-blue w-100">Update UserInfo</button>
        </form>

        <button type="submit" className="mb-3 btn btn-primary custom-btn-blue w-100">Update Password</button>

      </div>

      </div>
    </div>
  )
}

export default User
