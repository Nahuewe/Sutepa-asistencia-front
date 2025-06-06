import React, { useRef, useEffect, useState } from 'react'
import SimpleBar from 'simplebar-react'
import SidebarLogo from './Logo'
import Navmenu from './Navmenu'
import { menuAdmin, menuSecretario, menuIngreso, menuEgreso, menuAfiliado } from '@/constant/data'
import useSemiDark from '@/hooks/useSemiDark'
import useSidebar from '@/hooks/useSidebar'
import useSkin from '@/hooks/useSkin'

const Sidebar = ({ user }) => {
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

  const [collapsed] = useSidebar()
  const [menuHover, setMenuHover] = useState(false)
  const [isSemiDark] = useSemiDark()
  const [skin] = useSkin()

  return (
    <div className={isSemiDark ? 'dark' : ''}>
      <div
        className={`sidebar-wrapper bg-white  dark:bg-slate-800     ${
          collapsed ? 'w-[72px] close_sidebar' : 'w-[248px]'
        }
      ${menuHover ? 'sidebar-hovered' : ''}
      ${
        skin === 'bordered'
          ? 'border-r border-slate-200 dark:border-slate-700'
          : 'shadow-base'
      }
      `}
        onMouseEnter={() => {
          setMenuHover(true)
        }}
        onMouseLeave={() => {
          setMenuHover(false)
        }}
      >
        <SidebarLogo menuHover={menuHover} />
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
    </div>
  )
}

export default Sidebar
