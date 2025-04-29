/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createEgreso, getEgreso } from '@/services/registroService'
import { TextInput } from 'flowbite-react'
import { formatearFechaArgentina } from '@/constant/datos-id'
import Card from '@/components/ui/Card'
import Loading from '@/components/ui/Loading'
import columnRegistro from '@/json/columnRegistro'

export const Egreso = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [page] = useState(1)
  const [search, setSearch] = useState('')
  const { user } = useSelector((state) => state.auth)
  const usuarioDesdeQR = location.state?.usuarioDesdeQR

  useEffect(() => {
    if (usuarioDesdeQR) {
      createEgreso({
        dni: usuarioDesdeQR.dni,
        legajo: usuarioDesdeQR.legajo,
        nombre: usuarioDesdeQR.nombre,
        apellido: usuarioDesdeQR.apellido,
        roles_id: usuarioDesdeQR.roles_id,
        seccional_id: usuarioDesdeQR.seccional_id
      })
        .then(() => {
          console.log('Ingreso registrado:', usuarioDesdeQR)
          navigate(location.pathname, { replace: true, state: {} })
        })
        .catch(err => {
          console.error('Error registrando ingreso:', err)
        })
    }
  }, [usuarioDesdeQR, navigate, location])

  const { data: egresos, isLoading: isLoadingEgresos } = useQuery({
    queryKey: ['egreso', page],
    queryFn: () => getEgreso(page)
  })

  function addEgreso () {
    navigate('/qrscanner/egreso')
  }

  const onSearch = (event) => {
    setSearch(event.target.value)
  }

  return (
    <>
      {
        (isLoadingEgresos)
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Asistentes que Egresaron</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='relative'>
                      <TextInput
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

                    {[1, 3].includes(user.roles_id) && (
                      <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                        <div className='flex gap-2 items-center'>
                          <button
                            type='button'
                            onClick={addEgreso}
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
                            (egresos && egresos.length > 0)
                              ? (egresos.map((egreso) => (
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
