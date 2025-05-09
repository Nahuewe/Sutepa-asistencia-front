import React from 'react'
import { Link } from 'react-router-dom'
import LogoSutepa from '@/assets/images/logo/logo-sutepa.webp'
import useWidth from '@/hooks/useWidth'

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
