import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const UserLayout = ({ children }: Props) => {
  return (
    <MaxWidthWrapper>{children}</MaxWidthWrapper>
  )
}

export default UserLayout
