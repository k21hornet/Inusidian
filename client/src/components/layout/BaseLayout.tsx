import React, { type ReactNode } from 'react'
import Header from '../Header'
import { Container } from '@mui/material'

type BaseLayoutProps = {
  children: ReactNode
}

const BaseLayout: React.FC<BaseLayoutProps> = ({children}) => {
  return (
    <>
      <Header />

      <Container>
        { children }
      </Container>
    </>
  )
}

export default BaseLayout
