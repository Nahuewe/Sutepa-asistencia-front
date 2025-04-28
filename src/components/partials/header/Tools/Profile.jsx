import React from 'react'
import { useNavigate } from 'react-router-dom'
import Dropdown from '@/components/ui/Dropdown'
import Icon from '@/components/ui/Icon'
import { Menu } from '@headlessui/react'
import { useAuthStore } from '@/helpers/useAuthStore'
import { useSelector, useDispatch } from 'react-redux'
import { setActiveUser } from '@/store/user'
import { getTipoRoles } from '@/constant/datos-id'

const profileLabel = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useSelector(state => state.auth)
  return (
    <div className='flex items-center'>
      <div className='flex-1 ltr:mr-[10px] rtl:ml-[10px]'>
        <span>
          <div className='lg:h-[32px] lg:w-[32px] lg:bg-slate-100 lg:dark:bg-slate-900 dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center'>
            <Icon icon='heroicons-outline:user' />
          </div>
        </span>
      </div>

      <div className='flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap'>
        <span className='overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px] block'>
          {user.nombre} {user.apellido}
        </span>
        <span className='text-base inline-block ltr:ml-[10px] rtl:mr-[10px]'>
          <Icon icon='heroicons-outline:chevron-down' />
        </span>
      </div>
    </div>
  )
}

const Profile = () => {
  const { startLogout } = useAuthStore()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const ProfileMenu = [
    {
      label: `${getTipoRoles(user.roles_id)}`,
      icon: 'heroicons-outline:badge-check',
      action: null
    },
    {
      label: 'Cambiar contraseña',
      icon: 'heroicons-outline:key',
      action: () => {
        navigate('/usuarios')
        dispatch(setActiveUser(user.id))
      }
    },
    {
      label: 'Cerrar Sesión',
      icon: 'heroicons-outline:logout',
      action: () => {
        startLogout()
      }
    }
  ]

  return (
    <>
      <Dropdown label={profileLabel()} classMenuItems='w-[180px] top-[58px]'>
        {ProfileMenu.map((item, index) => (
          <Menu.Item key={index}>
            {({ active }) => (
              <div
                // eslint-disable-next-line react/jsx-handler-names
                onClick={item.action}
                className={`${
                  active
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50'
                    : 'text-slate-600 dark:text-slate-300'
                } block     ${
                  item.hasDivider
                    ? 'border-t border-slate-100 dark:border-slate-700'
                    : ''
                }`}
              >
                <div className='block cursor-pointer px-4 py-2'>
                  <div className='flex items-center'>
                    <span className='block text-xl ltr:mr-3 rtl:ml-3'>
                      <Icon icon={item.icon} />
                    </span>
                    <span className='block text-sm'>{item.label}</span>
                  </div>
                </div>
              </div>
            )}
          </Menu.Item>
        ))}
      </Dropdown>
    </>
  )
}

export default Profile
