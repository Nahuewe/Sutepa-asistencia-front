/* eslint-disable camelcase */
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getVotacion, createVoto, getVotacionExcel, getConteoVotacion, verificarVotoUsuario } from '@/services/votacionService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Card from '@/components/ui/Card'
import { getVotoExcel } from '../../services/votacionService'

export const Votaciones = () => {
  const queryClient = useQueryClient()
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage] = useState(initialPage)
  const [tiempoRestante, setTiempoRestante] = useState(15)
  const [yaVoto, setYaVoto] = useState(false)
  const [isLoadingVotacion, setIsLoadingVotacion] = useState(true)
  const [conteoVotos, setConteoVotos] = useState({
    afirmativo: 0,
    negativo: 0,
    abstencion: 0
  })

  const descargarVotacionesExcel = async () => {
    try {
      const blob = await getVotacionExcel()
      const url = window.URL.createObjectURL(new Blob([blob]))

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'votaciones.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error al exportar votaciones:', error)
      alert('No se pudo exportar las votaciones')
    }
  }

  const descargarVotosExcel = async () => {
    try {
      const blob = await getVotoExcel()
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'votos.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error al exportar votos:', error)
      alert('No se pudo exportar los votos')
    }
  }

  const { data: votaciones } = useQuery({
    queryKey: ['votacion', currentPage],
    queryFn: () => getVotacion(currentPage),
    keepPreviousData: true
  })

  const obtenerConteo = async (votacionId) => {
    try {
      const conteo = await getConteoVotacion(votacionId)
      setConteoVotos(conteo)
    } catch (error) {
      console.error('Error obteniendo conteo de votos:', error)
    }
  }

  function addVotacion () {
    navigate('/votaciones/crear')
    queryClient.invalidateQueries(['votacion', currentPage])
  }

  const handleVoto = async (votacionId, respuesta) => {
    try {
      if (yaVoto) {
        toast.error('Ya has votado en esta votación.')
        return
      }

      const asistenteId = user.id
      await createVoto({ votacion_id: votacionId, respuesta, asistente_id: asistenteId })
      toast.success(`Voto registrado exitosamente: ${respuesta.charAt(0).toUpperCase() + respuesta.slice(1)}`)
      setYaVoto(true)
      obtenerConteo(votacionId)
      queryClient.invalidateQueries(['votacion', currentPage])
    } catch (error) {
      const responseErrors = error?.response?.data?.errors
      const errorMessage = responseErrors
        ? responseErrors[Object.keys(responseErrors)[0]][0]
        : error.message || 'Error desconocido'
      toast.error(`Error al registrar el voto: ${errorMessage}`)
    }
  }

  useEffect(() => {
    if (!votaciones?.data?.length) return

    const ultimaVotacion = [...votaciones.data].sort((a, b) =>
      new Date(b?.activa_hasta) - new Date(a?.activa_hasta)
    )[0]

    const activaHasta = new Date(ultimaVotacion?.activa_hasta).getTime()
    obtenerConteo(ultimaVotacion.id)

    verificarVotoUsuario({ votacion_id: ultimaVotacion.id, asistente_id: user.id })
      .then(({ ya_voto }) => {
        setYaVoto(ya_voto)
        setIsLoadingVotacion(false)
      })
      .catch(() => {
        setYaVoto(false)
        setIsLoadingVotacion(false)
      })

    const interval = setInterval(() => {
      const ahora = new Date().getTime()
      const diferencia = Math.max(0, Math.floor((activaHasta - ahora) / 1000))
      setTiempoRestante(diferencia)

      if (diferencia > 0) {
        obtenerConteo(ultimaVotacion.id)
      } else {
        clearInterval(interval)
        setYaVoto(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [votaciones])

  return (
    <>
      {[1].includes(user.roles_id) && (
        <Card className='mb-4 px-4 py-6 sm:px-6'>
          <div className='mb-4 flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between'>
            <h1 className='text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white'>
              Listado de Votaciones
            </h1>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
              <button
                onClick={descargarVotacionesExcel}
                className='bg-green-600 hover:bg-green-800 text-white py-2 px-6 rounded-lg'
              >
                Exportar Excel de Votaciones
              </button>
              <button
                onClick={descargarVotosExcel}
                className='bg-yellow-600 hover:bg-yellow-800 text-white py-2 px-6 rounded-lg'
              >
                Exportar Excel de Votos
              </button>
              <button
                onClick={addVotacion}
                className='bg-indigo-600 hover:bg-indigo-800 text-white items-center text-center py-2 px-6 rounded-lg'
              >
                Agregar
              </button>
            </div>
          </div>
        </Card>
      )}

      <Card className='mb-4 px-4'>
        <div className='space-y-6'>
          {votaciones?.data?.length > 0
            ? (
                (() => {
                  const ultimaVotacion = [...votaciones.data].sort(
                    (a, b) => new Date(b?.activa_hasta) - new Date(a?.activa_hasta)
                  )[0]
                  return (
                    <div key={ultimaVotacion.id} className='p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 space-y-6'>
                      <div className='space-y-1'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{ultimaVotacion.tipo} - {ultimaVotacion.identificador}</h2>
                        {[1].includes(user.roles_id) && (
                          <p className='text-gray-600 dark:text-gray-300'>{ultimaVotacion.contenido}</p>
                        )}
                      </div>

                      <div className='flex flex-wrap gap-4'>
                        <div className='flex-1 min-w-[120px] bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-50 px-4 py-3 rounded-lg text-center'>
                          <p className='font-semibold'>Afirmativo</p>
                          <p className='text-xl font-bold'>{conteoVotos.afirmativo}</p>
                        </div>
                        <div className='flex-1 min-w-[120px] bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-50 px-4 py-3 rounded-lg text-center'>
                          <p className='font-semibold'>Negativo</p>
                          <p className='text-xl font-bold'>{conteoVotos.negativo}</p>
                        </div>
                        <div className='flex-1 min-w-[120px] bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-50 px-4 py-3 rounded-lg text-center'>
                          <p className='font-semibold'>Abstención</p>
                          <p className='text-xl font-bold'>{conteoVotos.abstencion}</p>
                        </div>
                      </div>

                      {!isLoadingVotacion && tiempoRestante > 0 && (
                        <p className='text-lg font-semibold text-center text-gray-500 dark:text-gray-400'>
                          Tiempo restante: <span className='font-medium'>{tiempoRestante}s</span>
                        </p>
                      )}

                      {!isLoadingVotacion && tiempoRestante > 0 && !yaVoto && (
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                          <button
                            className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition'
                            onClick={() => handleVoto(ultimaVotacion.id, 'afirmativo')}
                          >
                            Afirmativo
                          </button>
                          <button
                            className='bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition'
                            onClick={() => handleVoto(ultimaVotacion.id, 'negativo')}
                          >
                            Negativo
                          </button>
                          <button
                            className='bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition'
                            onClick={() => handleVoto(ultimaVotacion.id, 'abstencion')}
                          >
                            Abstenerse
                          </button>
                        </div>
                      )}

                      {!isLoadingVotacion && tiempoRestante === 0 && (
                        <div className='text-center mt-4'>
                          <p className='text-lg font-semibold text-red-600 dark:text-red-400'>
                            La votación ya finalizó.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })()
              )
            : (
              <p className='text-gray-600 dark:text-white text-center'>No hay votaciones disponibles.</p>
              )}
        </div>
      </Card>
    </>
  )
}
