import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import AuthTemplate from '../components/templates/AuthTemplate'
import AuthForm from '../components/organisms/AuthForm'

const SignInPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <AuthTemplate title="Sign In">

      <AuthForm
        onSubmit={handleLogin}
        submitText="Sign In"
        fields={[
          { label: 'Email',    type: 'email',    name: 'email',    value: email,    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
          { label: 'Password', type: 'password', name: 'password', value: password, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
        ]}
      />

      <p className='mt-10 text-center text-sm/6'>
        <Link to={"/signup"} className="font-semibold text-indigo-600 hover:text-indigo-500">If you don't have any account, click here.</Link>
      </p>

    </AuthTemplate>
  )
}

export default SignInPage
