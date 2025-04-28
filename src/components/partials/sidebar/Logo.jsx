import React from 'react'
import { Link } from 'react-router-dom'
import useDarkMode from '@/hooks/useDarkMode'
import useSemiDark from '@/hooks/useSemiDark'
import useSkin from '@/hooks/useSkin'
import LogoSutepa from '@/assets/images/logo/logo-sutepa.webp'

const SidebarLogo = ({ menuHover }) => {
  const [isDark] = useDarkMode()
  // semi dark
  const [isSemiDark] = useSemiDark()
  // skin
  const [skin] = useSkin()
  return (
    <div
      className={` logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] py-6  px-4 
      ${menuHover ? 'logo-hovered' : ''}
      ${
        skin === 'bordered'
          ? ' border-b border-r-0 border-slate-200 dark:border-slate-700'
          : ' border-none'
      }
      
      `}
    >
      <Link to='/'>
        <div className='flex items-center space-x-4'>
          <div className='logo-icon'>
            {!isDark && !isSemiDark
              ? (
                <img src={LogoSutepa} alt='Logo Sutepa' className='w-32 rounded-md' />
                )
              : (
                <img src={LogoSutepa} alt='Logo Sutepa' className='w-32 rounded-md' />
                )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default SidebarLogo
