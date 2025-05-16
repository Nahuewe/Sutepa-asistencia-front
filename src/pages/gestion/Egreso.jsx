import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import ExportButton from '@/components/buttons/ExportButton'
import Card from '@/components/ui/Card'
import Loading from '@/components/ui/Loading'
import Pagination from '@/components/ui/Pagination'
import SearchInput from '@/components/ui/SearchInput'
import { formatearFechaArgentina } from '@/constant/datos-id'
import { descargarEgresoExcel } from '@/export/exportarArchivos'
import columnRegistro from '@/json/columnRegistro'
import { createEgreso, getEgreso, searchRegistro } from '@/services/registroService'

export const Egreso = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const { user } = useSelector((state) => state.auth)
  const usuarioDesdeQR = location.state?.usuarioDesdeQR
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  const fetchRegistro = async () => {
    return debouncedSearch
      ? searchRegistro(debouncedSearch, currentPage)
      : getEgreso(currentPage)
  }

  const { data: egresos, isLoading: isLoadingEgresos } = useQuery({
    queryKey: ['egreso', currentPage, debouncedSearch],
    queryFn: () => fetchRegistro(currentPage),
    keepPreviousData: true
  })

  const onPageChange = (page) => {
    setCurrentPage(page)
    navigate(`?page=${page}`)
  }

  function registrarEgreso () {
    navigate(`/QR/egreso?page=${currentPage}`)
  }

  const onSearch = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    if (usuarioDesdeQR) {
      createEgreso({
        dni: usuarioDesdeQR.dni,
        legajo: usuarioDesdeQR.legajo,
        nombre: usuarioDesdeQR.nombre,
        apellido: usuarioDesdeQR.apellido,
        seccional: usuarioDesdeQR.seccional,
        seccional_id: usuarioDesdeQR.seccional_id
      })
        .then(() => {
          queryClient.invalidateQueries(['egreso'])
          navigate(location.pathname, { replace: true, state: {} })
        })
        .catch(err => {
          console.error('Error registrando egreso:', err)
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

  if (user.roles_id !== 1 && user.roles_id !== 4) {
    return <p className='text-red-600 font-semibold'>No tenés permisos para registrar egresos.</p>
  }

  return (
    <>
      {
        (isLoadingEgresos && !debouncedSearch)
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Egresos ({egresos?.meta?.total || 0})</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='relative'>
                      <SearchInput
                        name='search'
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
                      <ExportButton
                        descargaFn={descargarEgresoExcel}
                        nombreArchivo='Egresos'
                        textoBoton='Exportar Egresos'
                        textoExportando='Exportando Egresos...'
                      />
                    )}

                    {[1, 4].includes(user.roles_id) && (
                      <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                        <div className='flex gap-2 items-center'>
                          <button
                            type='button'
                            onClick={registrarEgreso}
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
                            (egresos?.data && egresos?.data.length > 0)
                              ? (egresos?.data.map((egreso) => (
                                <tr key={egreso.id}>
                                  <td className='table-td'>{egreso.asistente?.apellido || '-'}</td>
                                  <td className='table-td'>{egreso.asistente?.nombre || '-'}</td>
                                  <td className='table-td'>{egreso.asistente?.dni || '-'}</td>
                                  <td className='table-td'>{egreso.asistente?.legajo || '-'}</td>
                                  <td className='table-td'>{egreso.asistente?.seccional || '-'}</td>
                                  <td className='table-td'>{formatearFechaArgentina(egreso.registrado_en || '-')}</td>
                                </tr>
                                )))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                          }
                        </tbody>
                      </table>

                      <div className='flex justify-center mt-8'>
                        <Pagination
                          paginate={{
                            current_page: egresos?.meta?.current_page,
                            last_page: egresos?.meta?.last_page,
                            total: egresos?.meta?.total
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
