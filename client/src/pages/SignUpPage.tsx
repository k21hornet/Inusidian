import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import AuthTemplate from '../components/templates/AuthTemplate'
import AuthForm from '../components/organisms/AuthForm'

const SignUpPage = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <AuthTemplate title="Sign Up">

      <AuthForm
        onSubmit={handleRegister}
        submitText="Sign Up"
        fields={[
          { label: 'User Name',        type: 'text',     name: 'username',        value: username,        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value) },
          { label: 'Email',            type: 'email',    name: 'email',           value: email,           onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
          { label: 'Password',         type: 'password', name: 'password',        value: password,        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value) },
          { label: 'Password Confirm', type: 'password', name: 'passwordConfirm', value: passwordConfirm, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value) },
        ]}
      />

      <p className='mt-10 text-center text-sm/6'>
        <Link to={"/signin"} className="font-semibold text-indigo-600 hover:text-indigo-500">If you have an account, click here.</Link>
      </p>

    </AuthTemplate>
  )
}

export default SignUpPage
