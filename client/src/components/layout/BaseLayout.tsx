import React, { type ReactNode } from 'react'
import Header from '../common/Header'
import { Container } from '@mui/material'

type BaseLayoutProps = {
  children: ReactNode
}

const BaseLayout: React.FC<BaseLayoutProps> = ({children}) => {
  return (
    <>
      <Header />

      <Container maxWidth={'md'}>
        { children }
      </Container>
    </>
  )
}

export default BaseLayout
