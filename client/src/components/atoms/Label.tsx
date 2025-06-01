import React, { type ReactNode } from 'react'

type LabelProps = {
  htmlFor: string
  children: ReactNode
}

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm/6 font-medium text-gray-900">{children}</label>
  )
}

export default Label
