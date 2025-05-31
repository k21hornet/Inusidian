import React from 'react'
import Label from '../atoms/Label'
import InputField from '../atoms/InputField'

type FormGroupProps = {
  label: string
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FormGroup: React.FC<FormGroupProps> = ({ label, type, name, value, onChange }) => {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <InputField type={type} name={name} value={value} onChange={onChange} />
    </div>
  )
}

export default FormGroup
