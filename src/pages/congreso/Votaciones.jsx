/* eslint-disable camelcase */
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getVotacion, createVoto, getVotacionExcel, verificarVotoUsuario, getCantidadVotos, getVotoExcel, getUsuariosNoVotaron } from '@/services/votacionService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Card from '@/components/ui/Card'

export const Votaciones = () => {
  const { user } = useSelector((state) => state.auth)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const page = parseInt(new URLSearchParams(location.search).get('page') || '1', 10)
  const [currentPage] = useState(initialPage)
  const [tiempoRestante, setTiempoRestante] = useState(15)
  const [yaVoto, setYaVoto] = useState(false)
  const [isLoadingVotacion] = useState(true)
  const [usuariosQueVotaron, setUsuariosQueVotaron] = useState([])

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

  function addVotacion () {
    navigate('/votaciones/crear')
    queryClient.invalidateQueries(['votacion', currentPage])
  }

  const { data: votaciones } = useQuery({
    queryKey: ['votaciones', page],
    queryFn: () => getVotacion(page),
    keepPreviousData: true
  })

  // 2) Determinar la última votación activa
  const ultima = useMemo(() => {
    if (!votaciones?.data?.length) return null
    return [...votaciones.data].sort(
      (a, b) => new Date(b.activa_hasta) - new Date(a.activa_hasta)
    )[0]
  }, [votaciones])

  // 3) Traer sólo usuarios con cuenta que NO votaron esa votación
  const { data: usuariosSinVotar = [], refetch: refetchSinVotar } = useQuery({
    queryKey: ['sinVotar', ultima?.id],
    queryFn: async () => {
      const raw = await getUsuariosNoVotaron(ultima.id)
      return raw.map(u => ({ ...u, id: u.asistente_id }))
    },
    enabled: !!ultima?.id
  })

  // 4) Refrescar votos existentes y estado “ya votó”
  const refetchVerificacion = async () => {
    if (!ultima) return
    const { ya_voto } = await verificarVotoUsuario({
      votacion_id: ultima.id,
      asistente_id: user.id
    })
    setYaVoto(ya_voto)

    const respuestas = await getCantidadVotos(ultima.id)
    setUsuariosQueVotaron(respuestas)
  }

  // 5) Unificar función de voto (propio o admin)
  const handleVoto = async (votacionId, respuesta, asistenteId = user.id) => {
    if (asistenteId === user.id && yaVoto) {
      return toast.error('Ya has votado en esta votación.')
    }
    await createVoto({ votacion_id: votacionId, respuesta, asistente_id: asistenteId })
    toast.success(`Voto registrado: ${respuesta}`)
    if (asistenteId === user.id) setYaVoto(true)
    queryClient.invalidateQueries(['votaciones', page])
    await Promise.all([refetchVerificacion(), refetchSinVotar()])
  }
  useEffect(() => {
    if (!ultima) return
    refetchVerificacion()
    refetchSinVotar()

    const activaHasta = new Date(ultima.activa_hasta).getTime()
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((activaHasta - Date.now()) / 1000))
      setTiempoRestante(diff)
      if (diff > 0) {
        refetchVerificacion()
      } else {
        clearInterval(interval)
        setYaVoto(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [ultima])

  return (
    <>
      {[1, 2].includes(user.roles_id) && (
        <Card className='mb-4 px-4 py-6 sm:px-6'>
          <div className='mb-4 flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between'>
            <h1 className='text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white'>
              Listado de Votaciones
            </h1>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
              {user.roles_id === 1 && (
                <>
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
                </>
              )}
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
                        {[1, 2].includes(user.roles_id) && (
                          <p className='text-gray-600 dark:text-gray-300'>{ultimaVotacion.contenido}</p>
                        )}
                      </div>

                      {!isLoadingVotacion && tiempoRestante > 0 && !yaVoto && (
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
                            className='bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition'
                            onClick={() => handleVoto(ultimaVotacion.id, 'abstencion')}
                          >
                            Abstenerse
                          </button>
                        </div>
                      )}

                      {[1, 2].includes(user.roles_id) && (
                        <>
                          <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>Estado de la Votación</h2>

                          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>

                              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                <tr>
                                  <th scope='col' className='px-6 py-3'>
                                    Tipo de voto
                                  </th>
                                  <th scope='col' className='px-6 py-3'>
                                    Afiliados
                                  </th>
                                  <th scope='col' className='px-6 py-3 text-right'>
                                    Total
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr className='bg-green-50 border-b dark:bg-green-900 dark:bg-opacity-20 dark:border-gray-700'>
                                  <th scope='row' className='px-6 py-4 font-medium text-green-700 dark:text-green-400 whitespace-nowrap'>
                                    Afirmativo
                                  </th>
                                  <td className='px-6 py-4'>
                                    <div className='flex flex-wrap gap-2'>
                                      {usuariosQueVotaron
                                        .filter(usuario => usuario.respuesta === 'afirmativo')
                                        .map(usuario => (
                                          <span key={usuario.id} className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'>
                                            {usuario.apellido} {usuario.nombre}
                                          </span>
                                        ))}
                                    </div>
                                  </td>
                                  <td className='px-6 py-4 text-right font-bold text-green-700 dark:text-green-400'>
                                    {usuariosQueVotaron.filter(usuario => usuario.respuesta === 'afirmativo').length}
                                  </td>
                                </tr>

                                <tr className='bg-red-50 border-b dark:bg-red-900 dark:bg-opacity-20 dark:border-gray-700'>
                                  <th scope='row' className='px-6 py-4 font-medium text-red-700 dark:text-red-400 whitespace-nowrap'>
                                    Negativo
                                  </th>
                                  <td className='px-6 py-4'>
                                    <div className='flex flex-wrap gap-2'>
                                      {usuariosQueVotaron
                                        .filter(usuario => usuario.respuesta === 'negativo')
                                        .map(usuario => (
                                          <span key={usuario.id} className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'>
                                            {usuario.apellido} {usuario.nombre}
                                          </span>
                                        ))}
                                    </div>
                                  </td>
                                  <td className='px-6 py-4 text-right font-bold text-red-700 dark:text-red-400'>
                                    {usuariosQueVotaron.filter(usuario => usuario.respuesta === 'negativo').length}
                                  </td>
                                </tr>

                                <tr className='bg-blue-50 border-b dark:bg-blue-900 dark:bg-opacity-20 dark:border-gray-700'>
                                  <th scope='row' className='px-6 py-4 font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap'>
                                    Abstención
                                  </th>
                                  <td className='px-6 py-4'>
                                    <div className='flex flex-wrap gap-2'>
                                      {usuariosQueVotaron
                                        .filter(usuario => usuario.respuesta === 'abstencion')
                                        .map(usuario => (
                                          <span key={usuario.id} className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                                            {usuario.apellido} {usuario.nombre}
                                          </span>
                                        ))}
                                    </div>
                                  </td>
                                  <td className='px-6 py-4 text-right font-bold text-blue-700 dark:text-blue-400'>
                                    {usuariosQueVotaron.filter(usuario => usuario.respuesta === 'abstencion').length}
                                  </td>
                                </tr>

                                <tr className='bg-gray-50 border-b dark:bg-gray-700'>
                                  <th scope='row' className='px-6 py-4 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap'>
                                    No votaron
                                  </th>
                                  <td className='px-6 py-4'>
                                    <div className='flex flex-wrap gap-2'>
                                      {usuariosSinVotar.map(usuario => (
                                        <span key={usuario.id} className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'>
                                          {usuario.apellido} {usuario.nombre}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className='px-6 py-4 text-right font-bold text-gray-700 dark:text-gray-400'>
                                    {usuariosSinVotar.length}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <Card className='p-4'>
                            <h3 className='font-semibold mb-2'>Asignar Votos a Quienes No Votaron</h3>
                            <table className='w-full text-left'>
                              <thead><tr><th>Nombre</th><th>Acción</th></tr></thead>
                              <tbody>
                                {usuariosSinVotar.map(u => (
                                  <tr key={u.id}>
                                    <td>{u.apellido} {u.nombre}</td>
                                    <td className='flex gap-2'>
                                      {['afirmativo', 'negativo', 'abstencion'].map(res => (
                                        <button
                                          key={res}
                                          onClick={() => handleVoto(ultima.id, res, u.id)}
                                          className={`btn-${res}`}
                                        >
                                          {res.charAt(0).toUpperCase() + res.slice(1)}
                                        </button>
                                      ))}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </Card>

                        </>
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
