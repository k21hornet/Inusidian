import React from 'react'

const Label = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm/6 font-medium text-gray-900">{children}</label>
  )
}

export default Label
