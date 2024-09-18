import React from 'react'
import { useRouter } from 'next/router'
import { IsgFooter } from '../shared/isgFooter/isgFooter'
import IsgNavbar from '../shared/isgNavbar/isgNavbar'

export interface LayoutProps {
  children: any
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  const router = useRouter()

  const isMyAccountRoute = router.pathname.startsWith('/my-account')

  if (isMyAccountRoute) {
    return <>{children}</>
  }

  return (
    <>
      <IsgNavbar />
      {children}
      <IsgFooter />
    </>
  )
}

export default Layout
