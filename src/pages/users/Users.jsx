import { useQuery } from '@tanstack/react-query'
import { TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import EditButton from '@/components/buttons/EditButton'
import Card from '@/components/ui/Card'
import Loading from '@/components/ui/Loading'
import Pagination from '@/components/ui/Pagination'
import columnUsuario from '@/json/columnUsuario'
import { getUsuario, searchUsuario } from '@/services/UsuarioService'

export const Users = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  const fetchUsers = async () => {
    return debouncedSearch
      ? searchUsuario(debouncedSearch, currentPage)
      : getUsuario(currentPage)
  }

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['user', currentPage, debouncedSearch],
    queryFn: () => fetchUsers(currentPage),
    keepPreviousData: true
  })

  const filteredUsers = user.roles_id === 1 ? usuarios?.data : usuarios?.data.filter(users => users.id === user.id)

  const onPageChange = (page) => {
    setCurrentPage(page)
    navigate(`?page=${page}`)
  }

  function addUser () {
    navigate(`/asistentes/crear?page=${currentPage}`)
  }

  async function onEdit (id) {
    navigate(`/asistentes/editar/${id}?page=${currentPage}`)
  }

  const onSearch = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 1000)

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  return (
    <>
      {
        (isLoading && !debouncedSearch)
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'> Listado de Asistentes ({usuarios?.meta?.total || 0}) </h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='relative'>
                      <TextInput
                        name='search'
                        type='text'
                        placeholder='Buscar'
                        onChange={onSearch}
                        value={search}
                      />

                      <div
                        type='button'
                        className='absolute top-3 right-2'
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-search dark:stroke-white' width='16' height='16' viewBox='0 0 24 24' strokeWidth='1.5' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                          <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
                          <path d='M21 21l-6 -6' />
                        </svg>
                      </div>
                    </div>

                    {[1].includes(user.roles_id) && (
                      <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                        <div className='flex gap-2 items-center'>
                          <button
                            type='button'
                            onClick={addUser}
                            className='bg-indigo-600 hover:bg-blue-800 text-white items-center text-center py-2 px-6 rounded-lg'
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card noborder>
                <div className='overflow-x-auto -mx-6'>
                  <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
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
                            (filteredUsers && filteredUsers.length > 0)
                              ? (filteredUsers.map((usuario) => (
                                <tr key={usuario.id}>
                                  <td className='table-td'>{usuario.apellido.toUpperCase() || '-'}</td>
                                  <td className='table-td'>{usuario.nombre.toUpperCase() || '-'}</td>
                                  <td className='table-td'>{usuario.dni || '-'}</td>
                                  <td className='table-td'>{usuario.legajo || '-'}</td>
                                  <td className='table-td'>{usuario.seccional || '-'}</td>
                                  <td className='table-td'>{usuario.rol || '-'}</td>
                                  <td className='table-td flex justify-start gap-2'>
                                    <EditButton evento={usuario} onEdit={onEdit} />
                                  </td>
                                </tr>
                                )))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                          }
                        </tbody>
                      </table>

                      {
                        user.roles_id === 1 && (
                          <div className='flex justify-center mt-8'>
                            <Pagination
                              paginate={{
                                current_page: usuarios?.meta?.current_page,
                                last_page: usuarios?.meta?.last_page,
                                total: usuarios?.meta?.total
                              }}
                              onPageChange={onPageChange}
                              text
                            />
                          </div>
                        )
                      }

                    </div>
                  </div>
                </div>
              </Card>
            </>
            )
      }
    </>
  )
}
