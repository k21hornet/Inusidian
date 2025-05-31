import React from 'react'
import FormGroup from '../molecules/FormGroup'
import AuthButton from '../atoms/AuthButton'

type FormGroupProps = {
  label: string
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type AuthFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  fields: FormGroupProps[]
  submitText: string
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, fields, submitText }) => {

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      {fields.map(field => (
        <FormGroup key={field.name} {...field} />
      ))}

      <AuthButton submitText={submitText} />
    </form>
  )
}

export default AuthForm
