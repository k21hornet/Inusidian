import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const logout = async () => {
    const check = window.confirm("Are you sure you want to log out?")
    if (!check) return

    try {
      await axios.post(`${import.meta.env.VITE_API}/auth/logout`,{}, { withCredentials: true })
      navigate('/signin')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <header className='w-full shadow text-indigo-900'>
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8">
        <div>
          <Link to="/" className="text-2xl font-bold hover:text-indigo-600">INUSIDIAN</Link>
        </div>

        <div className="flex space-x-6 items-center w-10">
          <button className='bg-indigo-100 rounded-full' onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src={import.meta.env.VITE_LINK + "/ikemen.png"} alt="X" className='rounded-full'/>
          </button>
        </div>

        {dropdownOpen && (
          <div className="absolute top-12 right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50">
            <Link
              to="/user"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
              onClick={() => setDropdownOpen(false)}
            >
              User Info
            </Link>
            <button
              onClick={() => {
                setDropdownOpen(false)
                logout()
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}

      </nav>
    </header>
  )
}

export default Header
