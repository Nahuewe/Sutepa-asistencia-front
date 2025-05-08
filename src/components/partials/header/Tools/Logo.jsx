import { Link } from 'react-router-dom'
import React from 'react'
import useWidth from '@/hooks/useWidth'

import LogoSutepa from '@/assets/images/logo/logo-sutepa.webp'
const Logo = () => {
  const { width, breakpoints } = useWidth()

  return (
    <div>
      <Link to='/'>
        {width >= breakpoints.xl
          ? (
            <img src={LogoSutepa} alt='' className='w-32 rounded-md' />
            )
          : (
            <img src={LogoSutepa} alt='' className='w-32 rounded-md' />
            )}
      </Link>
    </div>
  )
}

export default Logo
