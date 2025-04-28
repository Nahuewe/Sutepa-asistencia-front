/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import EditModal from '@/components/ui/EditModal'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { useDispatch, useSelector } from 'react-redux'
import { handleShowDelete, handleShowEdit } from '@/store/layout'
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

  function onDelete (id) {
    dispatch(setActiveUser(id))
    dispatch(handleShowDelete())
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
                      labelClass='bg-blue-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
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
                              <td className='table-td'>{usuario.user || '-'}</td>
                              <td className='table-td'>{usuario.telefono || '-'}</td>
                              <td className='table-td'>{usuario.rol || '-'}</td>
                              <td className='table-td'>
                                <span
                                  className={`inline-block px-3 min-w-[90px] text-center py-1 rounded-full bg-opacity-25 ${usuario.estado === 'ACTIVO'
                                    ? 'text-black bg-success-500 dark:text-black dark:bg-success-400'
                                    : 'text-black bg-danger-500 dark:text-black dark:bg-danger-500'
                                    }`}
                                >
                                  {usuario.estado === 'ACTIVO' ? 'ACTIVO' : 'INACTIVO'}
                                </span>
                              </td>
                              <td className='table-td flex justify-start gap-2'>
                                <Tooltip content='Editar' placement='top' arrow animation='shift-away'>
                                  <button
                                    className={`bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 ${usuario.estado === 'INACTIVO' ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                    onClick={() => usuario.estado === 'ACTIVO' && onEdit(usuario.id)}
                                    disabled={usuario.estado === 'INACTIVO'}
                                  >
                                    <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-pencil' width='24' height='24' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                                      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                      <path d='M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4' />
                                      <path d='M13.5 6.5l4 4' />
                                    </svg>
                                  </button>
                                </Tooltip>

                                {user.roles_id === 1 && (
                                  <Tooltip
                                    content={usuario.estado === 'ACTIVO' ? 'Eliminar' : 'Reactivar'}
                                    placement='top'
                                    arrow
                                    animation='shift-away'
                                  >
                                    <button
                                      className={`p-2 rounded-lg ${usuario.estado === 'ACTIVO' ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white`}
                                      onClick={() => onDelete(usuario.id)}
                                    >
                                      {usuario.estado === 'ACTIVO'
                                        ? (
                                          <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-trash' width='24' height='24' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                                            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                            <path d='M4 7l16 0' />
                                            <path d='M10 11l0 6' />
                                            <path d='M14 11l0 6' />
                                            <path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
                                            <path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
                                          </svg>
                                          )
                                        : (
                                          <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-arrow-back-up' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                                            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                            <path d='M9 14l-4 -4l4 -4' />
                                            <path d='M5 10h11a4 4 0 1 1 0 8h-1' />
                                          </svg>
                                          )}
                                    </button>
                                  </Tooltip>
                                )}

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
