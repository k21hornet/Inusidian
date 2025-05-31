import React, { type ReactNode } from 'react'
import Header from '../Header'

type BaseTemplateProps = {
  children: ReactNode
}

const BaseTemplate: React.FC<BaseTemplateProps> = ({children}) => {
  return (
    <div className='min-h-screen w-full flex flex-col items-center'>
      <Header />

      {children}
    </div>
  )
}

export default BaseTemplate
