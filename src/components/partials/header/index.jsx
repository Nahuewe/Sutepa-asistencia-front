import React from 'react'
import Logo from './Tools/Logo'
import Profile from './Tools/Profile'
import SwitchDark from './Tools/SwitchDark'
import Icon from '@/components/ui/Icon'
import useMenulayout from '@/hooks/useMenulayout'
import useMobileMenu from '@/hooks/useMobileMenu'
import useNavbarType from '@/hooks/useNavbarType'
// import useRtl from '@/hooks/useRtl'
// import useSidebar from '@/hooks/useSidebar'
import useSkin from '@/hooks/useSkin'
import useWidth from '@/hooks/useWidth'

const Header = ({ className = 'custom-class' }) => {
  // const [collapsed, setMenuCollapsed] = useSidebar()
  const { width, breakpoints } = useWidth()
  const [navbarType] = useNavbarType()
  const navbarTypeClass = () => {
    switch (navbarType) {
      case 'floating':
        return 'floating  has-sticky-header'
      case 'sticky':
        return 'sticky top-0 z-[999]'
      case 'static':
        return 'static'
      case 'hidden':
        return 'hidden'
      default:
        return 'sticky top-0'
    }
  }
  const [menuType] = useMenulayout()
  const [skin] = useSkin()
  // const [isRtl] = useRtl()

  const [mobileMenu, setMobileMenu] = useMobileMenu()

  const handleOpenMobileMenu = () => {
    setMobileMenu(!mobileMenu)
  }

  const borderSwicthClass = () => {
    if (skin === 'bordered' && navbarType !== 'floating') {
      return 'border-b border-slate-200 dark:border-slate-700'
    } else if (skin === 'bordered' && navbarType === 'floating') {
      return 'border border-slate-200 dark:border-slate-700'
    } else {
      return 'dark:border-b dark:border-slate-700 dark:border-opacity-60'
    }
  }
  return (
    <header className={className + ' ' + navbarTypeClass()}>
      <div
        className={` app-header md:px-6 px-[15px]  dark:bg-slate-800 shadow-base dark:shadow-base3 bg-white
        ${borderSwicthClass()}
             ${
               menuType === 'horizontal' && width > breakpoints.xl
                 ? 'py-1'
                 : 'md:py-6 py-3'
             }
        `}
      >
        <div className='flex justify-between items-center h-full'>

          {menuType === 'vertical' && (
            <div className='flex items-center md:space-x-4 space-x-2 rtl:space-x-reverse'>
              {/* {collapsed && width >= breakpoints.xl && (
                <button
                  className='text-xl text-slate-900 dark:text-white'
                  onClick={() => setMenuCollapsed(!collapsed)}
                >
                  {isRtl
                    ? (
                      <Icon icon='akar-icons:arrow-left' />
                      )
                    : (
                      <Icon icon='akar-icons:arrow-right' />
                      )}
                </button>
              )} */}
              {width < breakpoints.xl && <Logo />}

              {width < breakpoints.xl && width >= breakpoints.md && (
                <div
                  className='cursor-pointer text-slate-900 dark:text-white text-2xl'
                  onClick={handleOpenMobileMenu}
                >
                  <Icon icon='heroicons-outline:menu-alt-3' />
                </div>
              )}

            </div>
          )}
          <span className='text-red-600 dark:text-red-400 hidden md:block font-extrabold'>Sindicato Unido de Trabajadores y Empleados de PAMI</span>

          {menuType === 'horizontal' && (
            <div className='flex items-center space-x-4 rtl:space-x-reverse'>
              <Logo />

              {width <= breakpoints.xl && (
                <div
                  className='cursor-pointer text-slate-900 dark:text-white text-2xl'
                  onClick={handleOpenMobileMenu}
                >
                  <Icon icon='heroicons-outline:menu-alt-3' />
                </div>
              )}
            </div>
          )}
          <div className='nav-tools flex items-center space-x-3 rtl:space-x-reverse'>

            <SwitchDark />

            <Profile />
            {width <= breakpoints.md && (
              <div
                className='cursor-pointer text-slate-900 dark:text-white text-2xl'
                onClick={handleOpenMobileMenu}
              >
                <Icon icon='heroicons-outline:menu-alt-3' />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
