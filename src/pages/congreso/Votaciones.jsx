import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getVotacion, createVoto } from '@/services/votacionService'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { formatearFechaArgentina } from '@/constant/datos-id'
import Card from '@/components/ui/Card'

export const Votaciones = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage] = useState(initialPage)

  const { data: votaciones } = useQuery({
    queryKey: ['votacion', currentPage],
    queryFn: () => getVotacion(currentPage),
    keepPreviousData: true
  })

  function addVotacion () {
    navigate('/votaciones/crear')
  }

  const handleVoto = async (votacionId, respuesta) => {
    try {
      const asistenteId = user.id
      await createVoto({ votacion_id: votacionId, respuesta, asistente_id: asistenteId })
      toast.success('Voto registrado exitosamente')
    } catch (error) {
      const responseErrors = error?.response?.data?.errors
      const errorMessage = responseErrors
        ? responseErrors[Object.keys(responseErrors)[0]][0]
        : error.message || 'Error desconocido'
      toast.error(`Error al registrar el voto: ${errorMessage}`)
    }
  }

  const renderOpciones = (votacionId) => (
    <div className='flex gap-2 mt-2'>
      <button
        className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg'
        onClick={() => handleVoto(votacionId, 'afirmativo')}
      >
        Afirmativo
      </button>
      <button
        className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg'
        onClick={() => handleVoto(votacionId, 'negativo')}
      >
        Negativo
      </button>
      <button
        className='bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg'
        onClick={() => handleVoto(votacionId, 'abstencion')}
      >
        Abstenerse
      </button>
    </div>
  )

  return (
    <>
      <Card className='mb-4'>
        <div className='mb-4 md:flex md:justify-between'>
          <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Votaciones</h1>
          {user.roles_id === 1 && (
            <div className='flex gap-2 items-center'>
              <button
                type='button'
                onClick={addVotacion}
                className='bg-indigo-600 hover:bg-indigo-800 text-white py-2 px-6 rounded-lg'
              >
                Agregar
              </button>
            </div>
          )}
        </div>
      </Card>

      <Card noborder>
        <div className='overflow-x-auto mx-2'>
          <div className='inline-block min-w-full align-middle'>
            <div className='overflow-hidden space-y-4'>
              {votaciones?.data?.length > 0
                ? (
                    (() => {
                      const ultimaVotacion = [...votaciones.data].sort((a, b) => new Date(b?.activa_hasta) - new Date(a?.activa_hasta))[0]
                      return (
                        <div key={ultimaVotacion.id} className='border-b pb-4'>
                          {user.roles_id === 1
                            ? (
                              <p className='text-lg font-medium text-gray-800 dark:text-white'>{ultimaVotacion?.tipo} - {ultimaVotacion?.identificador} - {ultimaVotacion?.contenido} - Activo hasta {formatearFechaArgentina(ultimaVotacion?.activa_hasta)}</p>
                              )
                            : (
                              <>
                                <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                                  {ultimaVotacion?.tipo} - {ultimaVotacion?.identificador.split(':')[0]}
                                </p>
                                {renderOpciones(ultimaVotacion.id)}
                              </>
                              )}
                        </div>
                      )
                    })()
                  )
                : (
                  <p className='text-gray-600 dark:text-white'>No hay votaciones disponibles.</p>
                  )}
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}
