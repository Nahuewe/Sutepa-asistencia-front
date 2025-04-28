/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import EditModal from '@/components/ui/EditModal'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { useDispatch, useSelector } from 'react-redux'
import { handleShowEdit } from '@/store/layout'
import { useUserStore } from '@/helpers'
import { setActiveUser } from '@/store/user'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import Tooltip from '@/components/ui/Tooltip'
import { UserForm } from '../components/forms/'
import columnUsuario from '@/json/columnUsuario'

export const Users = () => {
  const { users, paginate, activeUser, startLoadingUsers, startSavingUser, startDeleteUser, startUpdateUser } = useUserStore()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  const filteredUsers = user.roles_id === 1 ? users : users.filter(users => users.id === user.id)

  function onEdit (id) {
    dispatch(setActiveUser(id))
    dispatch(handleShowEdit())
  }

  async function loadingUsers (page = 1) {
    !isLoading && setIsLoading(true)

    await startLoadingUsers(page)
    setIsLoading(false)
  }

  useEffect(() => {
    loadingUsers()
  }, [])

  return (
    <>
      {
        (isLoading)
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <Card
              title='Listado de Usuarios'
              headerslot={
                <div className='flex gap-2'>
                  {user.roles_id === 1 && (
                    <Modal
                      title='Agregar Usuario'
                      label='Agregar'
                      labelClass='bg-red-600 hover:bg-red-800 text-white items-center text-center py-2 px-6 rounded-lg'
                      centered
                      children={
                        <UserForm
                          fnAction={startSavingUser}
                        />
                    }
                    />
                  )}

                  <EditModal
                    title='Editar Usuario'
                    centered
                    children={
                      <UserForm
                        fnAction={startUpdateUser}
                        activeUser={activeUser}
                      />
                    }
                  />

                  <DeleteModal
                    themeClass='bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700'
                    centered
                    title='Acciones del Usuario'
                    message='¿Estás seguro?'
                    labelBtn='Aceptar'
                    btnFunction={startDeleteUser}
                  />
                </div>
              }
              noborder
            >
              <div className='overflow-x-auto -mx-6'>
                <div className='inline-block min-w-full align-middle'>
                  <div className='overflow-hidden '>
                    <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                      <thead className='bg-slate-200 dark:bg-slate-700'>
                        <tr>
                          {columnUsuario.map((column, i) => (
                            <th key={i} scope='col' className='table-th'>
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                        {
                          (filteredUsers.length > 0) && filteredUsers.map((usuario) => (
                            <tr key={usuario.id}>
                              <td className='table-td'>{usuario.nombre || '-'}</td>
                              <td className='table-td'>{usuario.apellido || '-'}</td>
                              <td className='table-td'>{usuario.dni || '-'}</td>
                              <td className='table-td'>{usuario.user || '-'}</td>
                              <td className='table-td'>{usuario.seccional || '-'}</td>
                              <td className='table-td'>{usuario.rol || '-'}</td>
                              <td className='table-td flex justify-start gap-2'>
                                <Tooltip content='Editar' placement='top' arrow animation='shift-away'>
                                  <button
                                    className={`bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 ${usuario.estado === 'INACTIVO' ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    onClick={() => onEdit(usuario.id)}
                                  >
                                    <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-pencil' width='24' height='24' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                                      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                      <path d='M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4' />
                                      <path d='M13.5 6.5l4 4' />
                                    </svg>
                                  </button>
                                </Tooltip>

                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>

                    {/* Paginado */}
                    {
                      user.roles_id === 1 && paginate && (
                        <div className='flex justify-center mt-8'>
                          <Pagination
                            paginate={paginate}
                            onPageChange={(page) => loadingUsers(page)}
                            text
                          />
                        </div>
                      )
                    }

                  </div>
                </div>
              </div>
            </Card>
            )
      }
    </>
  )
}
