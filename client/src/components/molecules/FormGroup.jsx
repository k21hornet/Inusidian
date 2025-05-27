import React from 'react'
import Label from '../atoms/Label'
import InputField from '../atoms/InputField'

const FormGroup = ({ label, type, name, value, onChange }) => {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <InputField type={type} name={name} value={value} onChange={onChange} />
    </div>
  )
}

export default FormGroup
