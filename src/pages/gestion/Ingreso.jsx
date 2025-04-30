/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createIngreso, getIngreso, getIngresoExcel, searchRegistro } from '@/services/registroService'
import { TextInput } from 'flowbite-react'
import { formatearFechaArgentina } from '@/constant/datos-id'
import Card from '@/components/ui/Card'
import Loading from '@/components/ui/Loading'
import columnRegistro from '@/json/columnRegistro'
import Pagination from '@/components/ui/Pagination'

export const Ingreso = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const { user } = useSelector((state) => state.auth)
  const usuarioDesdeQR = location.state?.usuarioDesdeQR

  const descargarExcel = async () => {
    try {
      const blob = await getIngresoExcel()
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'ingresos.xlsx')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error descargando Excel:', error)
    }
  }

  const fetchRegistro = async () => {
    return debouncedSearch
      ? searchRegistro(debouncedSearch, currentPage)
      : getIngreso(currentPage)
  }

  const { data: ingresos, isLoading: isLoadingIngresos } = useQuery({
    queryKey: ['ingreso', currentPage, debouncedSearch],
    queryFn: () => fetchRegistro(currentPage),
    keepPreviousData: true
  })

  const onPageChange = (page) => {
    setCurrentPage(page)
    navigate(`?page=${page}`)
  }

  function registrarIngreso () {
    navigate(`/QR/ingreso?page=${currentPage}`)
  }

  const onSearch = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    if (usuarioDesdeQR) {
      createIngreso({
        dni: usuarioDesdeQR.dni,
        legajo: usuarioDesdeQR.legajo,
        nombre: usuarioDesdeQR.nombre,
        apellido: usuarioDesdeQR.apellido,
        seccional: usuarioDesdeQR.seccional,
        seccional_id: usuarioDesdeQR.seccional_id
      })
        .then(() => {
          queryClient.invalidateQueries(['ingreso'])
          navigate(location.pathname, { replace: true, state: {} })
        })
        .catch(err => {
          console.error('Error registrando ingreso:', err)
        })
    }
  }, [usuarioDesdeQR, navigate, location, queryClient])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 1000)

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  if (user.roles_id !== 1 && user.roles_id !== 2) {
    return <p className='text-red-600 font-semibold'>No tenés permisos para registrar ingresos.</p>
  }

  return (
    <>
      {
        (isLoadingIngresos)
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Asistentes que Ingresaron</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='relative'>
                      <TextInput
                        name='search'
                        placeholder='Buscar'
                        onChange={onSearch}
                        value={search}
                      />
                      <div type='button' className='absolute top-3 right-2'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-search dark:stroke-white' width='16' height='16' viewBox='0 0 24 24' strokeWidth='1.5' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                          <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
                          <path d='M21 21l-6 -6' />
                        </svg>
                      </div>
                    </div>

                    {[1].includes(user.roles_id) && (
                      <button
                        onClick={descargarExcel}
                        className='bg-green-600 hover:bg-green-800 text-white py-2 px-6 rounded-lg'
                      >
                        Exportar Excel
                      </button>
                    )}

                    {[1, 2].includes(user.roles_id) && (
                      <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                        <div className='flex gap-2 items-center'>
                          <button
                            type='button'
                            onClick={registrarIngreso}
                            className='bg-indigo-600 hover:bg-indigo-800 text-white items-center text-center py-2 px-6 rounded-lg'
                          >
                            Escanear
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
                            {columnRegistro.map((column, i) => (
                              <th key={i} scope='col' className='table-th'>
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                          {
                            (ingresos?.data && ingresos.data.length > 0)
                              ? ingresos.data.map((ingreso) => (
                                <tr key={ingreso.id}>
                                  <td className='table-td'>{ingreso?.asistente?.apellido || '-'}</td>
                                  <td className='table-td'>{ingreso?.asistente?.nombre || '-'}</td>
                                  <td className='table-td'>{ingreso?.asistente?.dni || '-'}</td>
                                  <td className='table-td'>{ingreso?.asistente?.legajo || '-'}</td>
                                  <td className='table-td'>{ingreso?.asistente?.seccional || '-'}</td>
                                  <td className='table-td'>{formatearFechaArgentina(ingreso?.registrado_en || '-')}</td>
                                </tr>
                              ))
                              : <tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>
                          }
                        </tbody>
                      </table>

                      <div className='flex justify-center mt-8'>
                        <Pagination
                          paginate={{
                            current_page: ingresos?.meta?.current_page,
                            last_page: ingresos?.meta?.last_page,
                            total: ingresos?.meta?.total
                          }}
                          onPageChange={onPageChange}
                          text
                        />
                      </div>

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
