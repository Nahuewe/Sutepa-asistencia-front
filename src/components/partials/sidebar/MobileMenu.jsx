import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { menuItems, menuNormal } from '@/constant/data' // Menu de los usuarios
import Navmenu from './Navmenu'
import SimpleBar from 'simplebar-react'
import useSemiDark from '@/hooks/useSemiDark'
import useDarkMode from '@/hooks/useDarkMode'
import useMobileMenu from '@/hooks/useMobileMenu'
import Icon from '@/components/ui/Icon'
import LogoSutepa from '@/assets/images/logo/logo-sutepa.webp'

const MobileMenu = ({ className = 'custom-class', user }) => {
  const scrollableNodeRef = useRef()
  const [scroll, setScroll] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true)
      } else {
        setScroll(false)
      }
    }
    scrollableNodeRef.current.addEventListener('scroll', handleScroll)
  }, [scrollableNodeRef])

  const [isSemiDark] = useSemiDark()
  const [isDark] = useDarkMode()
  const [mobileMenu, setMobileMenu] = useMobileMenu()
  return (
    <div
      className={`${className} fixed  top-0 bg-white dark:bg-slate-800 shadow-lg  h-full   w-[248px]`}
    >
      <div className='logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] h-[85px]  px-4 '>
        <Link to='/afiliados'>
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
        <button
          type='button'
          onClick={() => setMobileMenu(!mobileMenu)}
          className='cursor-pointer text-slate-900 dark:text-white text-2xl'
        >
          <Icon icon='heroicons:x-mark' />
        </button>
      </div>

      <div
        className={`h-[60px]  absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
          scroll ? ' opacity-100' : ' opacity-0'
        }`}
      />
      <SimpleBar
        className='sidebar-menu px-4 h-[calc(100%-80px)]'
        scrollableNodeProps={{ ref: scrollableNodeRef }}
      >
        {/* Opciones de menu */}
        <Navmenu menus={(user.roles_id === 1) ? menuItems : menuNormal} />
      </SimpleBar>
    </div>
  )
}

export default MobileMenu
