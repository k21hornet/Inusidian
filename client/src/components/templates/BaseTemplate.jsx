import React from 'react'
import Header from '../Header'

const BaseTemplate = ({children}) => {
  return (
    <div className='min-h-screen w-full flex flex-col items-center'>
      <Header />

      {children}
    </div>
  )
}

export default BaseTemplate
