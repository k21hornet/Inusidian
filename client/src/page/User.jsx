import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useUser } from '../contexts/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const User = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordCofirm] = useState("");
  const { user, setUser } = useUser()

  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const navigate = useNavigate()

  const update = async (e) => {
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
        navigate("/login")
      }
    } catch (e) {
      console.log(e)      
    }
  }

  const updatePassword = async (e) => {
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

        <button type="submit" onClick={openModal} className="mb-3 btn btn-primary custom-btn-blue w-100">Update Password</button>

      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onClick={closeModal}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()} // モーダル本体のクリックは無視
          >
            <div className="modal-content">
              <div className="modal-body">
                <h3 className='text-center'>Update Password</h3>

                <form onSubmit={updatePassword}>
                  <div className="mb-3">
                    <label className="form-label small">Current Password</label>
                    <input
                      type="text"
                      name="oldPassword"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small">New Password</label>
                    <input
                      type="text"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small">New Password Confirm</label>
                    <input
                      type="text"
                      name="newPasswordConfirm"
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordCofirm(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <button type="submit" className="mb-3 btn btn-primary custom-btn-blue w-100">Save</button>

                </form>

                <div className='text-end'>
                  <span onClick={closeModal} style={{color: '#615fff'}}>Close</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  )
}

export default User
