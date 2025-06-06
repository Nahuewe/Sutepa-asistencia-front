import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import Navmenu from './Navmenu'
import LogoSutepa from '@/assets/images/logo/logo-sutepa.webp'
import Icon from '@/components/ui/Icon'
import { menuAdmin, menuSecretario, menuIngreso, menuEgreso, menuAfiliado } from '@/constant/data'
import useDarkMode from '@/hooks/useDarkMode'
import useMobileMenu from '@/hooks/useMobileMenu'
import useSemiDark from '@/hooks/useSemiDark'

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

  const getMenuByRole = (roleId) => {
    switch (roleId) {
      case 1:
        return menuAdmin
      case 2:
        return menuSecretario
      case 3:
        return menuIngreso
      case 4:
        return menuEgreso
      case 5:
        return menuAfiliado
      default:
        return []
    }
  }

  const [isSemiDark] = useSemiDark()
  const [isDark] = useDarkMode()
  const [mobileMenu, setMobileMenu] = useMobileMenu()

  return (
    <div
      className={`${className} fixed  top-0 bg-white dark:bg-slate-800 shadow-lg  h-full   w-[248px]`}
    >
      <div className='logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] h-[85px]  px-4 '>
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
        <Navmenu menus={getMenuByRole(user.roles_id)} />
      </SimpleBar>
    </div>
  )
}

export default MobileMenu
