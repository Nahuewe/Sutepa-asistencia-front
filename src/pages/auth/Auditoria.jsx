import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sutepaApi } from '@/api'
import { renderizarJson } from '@/components/buttons/RenderizarJson'
import Card from '@/components/ui/Card'
import Loading from '@/components/ui/Loading'
import Pagination from '@/components/ui/Pagination'
import { formatearFechaArgentina } from '@/constant/datos-id'
import columnAuditoria from '@/json/columnAuditoria'

export const Auditoria = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)

  const getAuditoria = async (page = 1) => {
    const { data } = await sutepaApi.get(`/auditoria?page=${page}`)
    return data
  }

  const { data: auditoria, isLoading } = useQuery({
    queryKey: ['auditoria', currentPage],
    queryFn: () => getAuditoria(currentPage),
    keepPreviousData: true
  })

  const auditorias = auditoria?.data || []
  const pagination = auditoria?.meta || {}

  const onPageChange = (page) => {
    setCurrentPage(page)
    navigate(`?page=${page}`)
  }

  return (
    <>
      {
        (isLoading)
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Auditoria</h1>
                </div>
              </Card>

              <Card noborder className='mt-4'>
                <div className='overflow-x-auto -mx-6'>
                  <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden'>
                      <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                        <thead className='bg-slate-200 dark:bg-slate-700'>
                          <tr>
                            {columnAuditoria.map((column, i) => (
                              <th key={i} scope='col' className='table-th'>
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                          {
                            (auditorias && auditorias.length > 0)
                              ? (auditorias.map((auditoria) => (
                                <tr key={auditoria.id}>
                                  <td className='table-td'>{auditoria.user.nombre} {auditoria.user.apellido}</td>
                                  <td className='table-td'>{auditoria.accion}</td>
                                  <td className='table-td'>{auditoria.modelo}</td>
                                  <td className='table-td'>{renderizarJson(auditoria.datos)}</td>
                                  <td className='table-td'>{formatearFechaArgentina(auditoria.created_at)}</td>
                                </tr>
                                )))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                            }
                        </tbody>
                      </table>

                      <div className='flex justify-center mt-8'>
                        <Pagination
                          paginate={{
                            current_page: pagination?.current_page,
                            last_page: pagination?.last_page,
                            total: pagination?.total
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
