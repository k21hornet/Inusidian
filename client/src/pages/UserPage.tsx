import { useEffect, useState } from 'react'
import { useUser } from '../contexts/UserContext'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import BaseTemplate from '../components/templates/BaseTemplate'

const UserPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordCofirm] = useState("");
  
  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)
  const navigate = useNavigate()

  useEffect(() => {
    setUserInfo()
  },[])
  
  const { user, setUser } = useUser()
  if (!user) return <Navigate to="/signin" />

  const setUserInfo = () => {
    setUsername(user.username)
    setEmail(user.email)
  }

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const updatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <BaseTemplate>

      <div className="flex flex-col items-center w-full max-w-5xl">
        <h1 className='text-3xl my-10'>UserInfo</h1>

        <div className='w-full max-w-md'>
          <form onSubmit={update} className='space-y-6'>
            <div>
              <label className="block text-sm/6 font-medium text-gray-900">ユーザー名</label>
              <input
                type="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>

            <div>
              <label className="block text-sm/6 font-medium text-gray-900">メールアドレス</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>

            <button 
              type="submit" 
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Update UserInfo</button>
          </form>

            <button 
              onClick={openModal} 
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Update Password</button>
        </div>


      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-xl font-semibold text-center mb-4'>Update Password</h3>

            <form onSubmit={updatePassword} className='space-y-6'>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Current Password</label>
                <input
                  type="text"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">New Password</label>
                <input
                  type="text"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <div>
                <label className="block text-sm/6 font-medium text-gray-900">New Password Confirm</label>
                <input
                  type="text"
                  name="newPasswordConfirm"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordCofirm(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>

              <button 
                type="submit" 
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Save</button>

            </form>

            <div className='text-end'>
              <span onClick={closeModal} style={{color: '#615fff'}}>Close</span>
            </div>

          </div>
        </div>
      )}

    </BaseTemplate>
  )
}

export default UserPage
