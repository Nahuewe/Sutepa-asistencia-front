/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchOrdenesDiarias, deleteOrdenesDiarias } from '@/services/ordenesDiariasService'
import { toast } from 'react-toastify'
import EditButton from '@/components/buttons/EditButton'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/ui/Loading'
import columnOrdenDiaria from '@/json/columnOrdenDiaria'
import DeleteButton from '@/components/buttons/DeleteButton'

export const OrdenesDiarias = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)

  const { data: ordenResponse, isLoading, refetch } = useQuery({
    queryKey: ['ordenDiaria', currentPage],
    queryFn: () => fetchOrdenesDiarias(currentPage),
    keepPreviousData: true
  })

  const ordenes = ordenResponse?.data || []
  const pagination = ordenResponse?.meta || {}

  const onPageChange = (page) => {
    setCurrentPage(page)
    navigate(`?page=${page}`)
  }

  function addOrdenDiaria () {
    navigate(`/ordenes-diarias/crear?page=${currentPage}`)
  }

  async function onEdit (id) {
    navigate(`/ordenes-diarias/editar/${id}?page=${currentPage}`)
  }

  async function onDelete (id) {
    try {
      await deleteOrdenesDiarias(id)
      toast.success('La orden diaria se eliminó')
      await refetch()
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al intentar eliminar')
    }
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
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Ordenes Del Día</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    {[1, 2].includes(user.roles_id) && (
                      <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                        <div className='flex gap-2 items-center'>
                          <button
                            type='button'
                            onClick={addOrdenDiaria}
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
                            {columnOrdenDiaria.map((column, i) => (
                              <th key={i} scope='col' className='table-th'>
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                          {
                            (ordenes && ordenes.length > 0)
                              ? (ordenes.map((orden) => (
                                <tr key={orden.id}>
                                  <td className='table-td'>{orden.tipo || '-'}</td>
                                  <td className='table-td'>{orden.identificador || '-'}</td>
                                  <td className='table-td'>{orden.contenido || '-'}</td>
                                  <td className='table-td flex justify-start gap-2'>
                                    <EditButton evento={orden} onEdit={onEdit} />
                                    <DeleteButton evento={orden} onDelete={onDelete} refetch={refetch} />
                                  </td>
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
