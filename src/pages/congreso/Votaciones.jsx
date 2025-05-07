/* eslint-disable camelcase */
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getVotacion, createVoto, verificarVotoUsuario, getCantidadVotos, getUsuariosNoVotaron } from '@/services/votacionService'
import { descargarVotacionesExcel, descargarVotosExcel } from '@/export/ExportarArchivos'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { GraficoTorta } from '@/pages/graficos/GraficoTorta'
import Loading from '@/components/ui/Loading'
import ExportButton from '@/components/buttons/ExportButton'
import { GraficoLinea } from '../graficos/GraficoLinea'

export const Votaciones = () => {
  const { user } = useSelector((state) => state.auth)
  const [respuestaVotada, setRespuestaVotada] = useState(null)
  const [tiempoRestante, setTiempoRestante] = useState(20)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [inicioVotacion, setInicioVotacion] = useState(Date.now())

  function addVotacion () {
    navigate('/votaciones/crear')
    queryClient.invalidateQueries({ queryKey: ['votaciones'] })
  }

  const { data: votaciones } = useQuery({
    queryKey: ['votaciones', initialPage],
    queryFn: () => getVotacion(initialPage),
    keepPreviousData: true
  })

  const ultima = useMemo(() => {
    if (!votaciones?.data?.length) return null
    return [...votaciones.data].sort(
      (a, b) => new Date(b.activa_hasta) - new Date(a.activa_hasta)
    )[0]
  }, [votaciones])

  const { data: verificacionData } = useQuery({
    queryKey: ['verificacion', ultima?.id, user.id],
    queryFn: async () => {
      if (!ultima) return { ya_voto: false }
      return verificarVotoUsuario({
        votacion_id: ultima.id,
        asistente_id: user.id
      })
    },
    enabled: !!ultima?.id
  })

  const { data: usuariosQueVotaron = [] } = useQuery({
    queryKey: ['usuariosVotaron', ultima?.id],
    queryFn: () => getCantidadVotos(ultima.id),
    enabled: !!ultima?.id,
    refetchInterval: tiempoRestante > 0 ? 1000 : false
  })

  const { data: usuariosSinVotar = [] } = useQuery({
    queryKey: ['sinVotar', ultima?.id],
    queryFn: async () => {
      if (!ultima) return []
      const raw = await getUsuariosNoVotaron(ultima.id)
      return raw.map(usuario => ({ ...usuario, id: usuario.asistente_id }))
    },
    enabled: !!ultima?.id
  })

  const yaVoto = verificacionData?.ya_voto || false

  const handleVoto = async (votacionId, respuesta, asistenteId = user.id) => {
    if (asistenteId === user.id && yaVoto) {
      return toast.error('Ya has votado en esta votación.')
    }

    await createVoto({ votacion_id: votacionId, respuesta, asistente_id: asistenteId })
    setRespuestaVotada(respuesta)

    queryClient.invalidateQueries({ queryKey: ['verificacion', votacionId] })
    queryClient.invalidateQueries({ queryKey: ['usuariosVotaron', votacionId] })
    queryClient.invalidateQueries({ queryKey: ['sinVotar', votacionId] })
  }

  useEffect(() => {
    if (!ultima) return

    const activaHasta = new Date(ultima.activa_hasta).getTime()

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((activaHasta - Date.now()) / 1000))
      setTiempoRestante(diff)

      if (diff === 0) {
        clearInterval(interval)
        queryClient.invalidateQueries({ queryKey: ['verificacion', ultima.id] })
        queryClient.invalidateQueries({ queryKey: ['usuariosVotaron', ultima.id] })
        queryClient.invalidateQueries({ queryKey: ['sinVotar', ultima.id] })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [ultima, queryClient])

  useEffect(() => {
    if (!ultima) return
    setInicioVotacion(Date.now() - (20 - tiempoRestante) * 1000)
  }, [ultima, tiempoRestante])

  useEffect(() => {
    setRespuestaVotada(null)
  }, [ultima?.id])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!yaVoto || respuestaVotada) return

    const votoUsuario = usuariosQueVotaron.find(usuario => usuario.asistente_id === user.id)
    if (votoUsuario) {
      setRespuestaVotada(votoUsuario.respuesta)
    }
  }, [yaVoto, respuestaVotada, usuariosQueVotaron, user.id])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      {[1, 2].includes(user.roles_id) && (
        <div className='flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 space-y-6 mb-4'>
          <h1 className='text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white'>
            Listado de Votaciones
          </h1>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
            {user.roles_id === 1 && (
              <>
                <ExportButton
                  descargaFn={descargarVotacionesExcel}
                  nombreArchivo='Votaciones'
                  textoBoton='Exportar Excel de Votaciones'
                  textoExportando='Exportando Votaciones...'
                />
                <ExportButton
                  descargaFn={descargarVotosExcel}
                  nombreArchivo='Votos'
                  textoBoton='Exportar Excel de Votos'
                  textoExportando='Exportando Votos...'
                  colors={{ normal: 'bg-yellow-600 hover:bg-yellow-800', exporting: 'bg-red-500 hover:bg-red-600' }}
                />
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
      )}

      <div className='space-y-6'>
        {votaciones?.data?.length > 0
          ? (
              (() => {
                const ultimaVotacion = ultima
                return (
                  <div key={ultimaVotacion.id} className='p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 space-y-6'>
                    <div className='space-y-1 ml-1'>
                      <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{ultimaVotacion.tipo} - {ultimaVotacion.identificador}</h2>
                      {[1, 2].includes(user.roles_id) && (
                        <p className='text-gray-600 dark:text-gray-300'>{ultimaVotacion.contenido}</p>
                      )}
                    </div>

                    {tiempoRestante > 0 && !yaVoto && (
                      <p className='text-lg font-semibold text-center text-gray-500 dark:text-gray-400'>
                        Tiempo restante: <span className='font-medium'>{tiempoRestante}s</span>
                      </p>
                    )}

                    {tiempoRestante > 0 && !yaVoto && (
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

                    {respuestaVotada && [3, 4, 5].includes(user.roles_id) && (
                      <div className={`text-center mt-4 font-semibold text-lg ${respuestaVotada === 'afirmativo'
                        ? 'text-green-600'
                        : respuestaVotada === 'negativo'
                          ? 'text-red-600'
                          : 'text-cyan-600'
                      }`}
                      >
                        Tu voto fue: {respuestaVotada.charAt(0).toUpperCase() + respuestaVotada.slice(1)}
                      </div>
                    )}

                    {[1, 2].includes(user.roles_id) && (
                      <>
                        <h2 className='text-lg ml-1 font-semibold text-gray-800 dark:text-white mb-4'>Estado de la Votación</h2>
                        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>

                            <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
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
                              <tr className='bg-green-200 dark:bg-green-900 dark:bg-opacity-20 dark:border-gray-700'>
                                <th scope='row' className='px-6 py-4 font-medium text-green-700 dark:text-green-400 whitespace-nowrap'>
                                  Afirmativo
                                </th>
                                <td className='px-6 py-4'>
                                  <div className='flex flex-wrap gap-2'>
                                    {usuariosQueVotaron
                                      .filter(usuario => usuario.respuesta === 'afirmativo')
                                      .map(usuario => (
                                        <span key={usuario.asistente_id} className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-300 text-green-950 dark:bg-green-900 dark:text-green-200'>
                                          {usuario.apellido}, {usuario.nombre}
                                        </span>
                                      ))}
                                  </div>
                                </td>
                                <td className='px-6 py-4 text-right font-bold text-green-700 dark:text-green-400'>
                                  {usuariosQueVotaron.filter(usuario => usuario.respuesta === 'afirmativo').length}
                                </td>
                              </tr>

                              <tr className='bg-red-200 dark:bg-red-900 dark:bg-opacity-20 dark:border-gray-700'>
                                <th scope='row' className='px-6 py-4 font-medium text-red-700 dark:text-red-400 whitespace-nowrap'>
                                  Negativo
                                </th>
                                <td className='px-6 py-4'>
                                  <div className='flex flex-wrap gap-2'>
                                    {usuariosQueVotaron
                                      .filter(usuario => usuario.respuesta === 'negativo')
                                      .map(usuario => (
                                        <span key={usuario.asistente_id} className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-300 text-red-950 dark:bg-red-900 dark:text-red-200'>
                                          {usuario.apellido}, {usuario.nombre}
                                        </span>
                                      ))}
                                  </div>
                                </td>
                                <td className='px-6 py-4 text-right font-bold text-red-700 dark:text-red-400'>
                                  {usuariosQueVotaron.filter(usuario => usuario.respuesta === 'negativo').length}
                                </td>
                              </tr>

                              <tr className='bg-cyan-200 dark:bg-cyan-900 dark:bg-opacity-20 dark:border-gray-700'>
                                <th scope='row' className='px-6 py-4 font-medium text-cyan-700 dark:text-cyan-400 whitespace-nowrap'>
                                  Abstención
                                </th>
                                <td className='px-6 py-4'>
                                  <div className='flex flex-wrap gap-2'>
                                    {usuariosQueVotaron
                                      .filter(usuario => usuario.respuesta === 'abstencion')
                                      .map(usuario => (
                                        <span key={usuario.asistente_id} className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-300 text-cyan-950 dark:bg-cyan-900 dark:text-cyan-200'>
                                          {usuario.apellido}, {usuario.nombre}
                                        </span>
                                      ))}
                                  </div>
                                </td>
                                <td className='px-6 py-4 text-right font-bold text-cyan-700 dark:text-cyan-400'>
                                  {usuariosQueVotaron.filter(usuario => usuario.respuesta === 'abstencion').length}
                                </td>
                              </tr>

                              <tr className='bg-gray-300 dark:bg-gray-700'>
                                <th scope='row' className='px-6 py-4 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap'>
                                  No votaron
                                </th>
                                <td className='px-6 py-4'>
                                  <div className='flex flex-wrap gap-2'>
                                    {usuariosSinVotar.map(usuario => (
                                      <span key={usuario.asistente_id} className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-300'>
                                        {usuario.apellido}, {usuario.nombre}
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

                        {tiempoRestante === 0 && usuariosSinVotar.length > 0 && (
                          <div>
                            <h3 className='text-lg ml-1 font-semibold text-gray-800 dark:text-white mb-4'>
                              Asignar votos a quienes no votaron
                            </h3>
                            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                              <table className='w-full text-sm text-left text-gray-700 dark:text-gray-300'>
                                <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                                  <tr>
                                    <th className='px-4 py-2'>Nombre</th>
                                    <th className='px-4 py-2'>Acción</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {usuariosSinVotar.map(usuario => (
                                    <tr key={usuario.asistente_id} className='bg-gray-50 dark:bg-gray-900 dark:bg-opacity-20 dark:border-gray-700 text-black dark:text-white'>
                                      <td className='px-4 py-2'>{usuario.apellido}, {usuario.nombre}</td>
                                      <td className='px-4 py-2 flex flex-wrap gap-2'>
                                        {['afirmativo', 'negativo', 'abstencion'].map(respuesta => {
                                          const colorMap = {
                                            afirmativo: 'bg-green-600 hover:bg-green-700',
                                            negativo: 'bg-red-600 hover:bg-red-700',
                                            abstencion: 'bg-cyan-600 hover:bg-cyan-700'
                                          }
                                          return (
                                            <button
                                              key={respuesta}
                                              onClick={() => handleVoto(ultima.id, respuesta, usuario.asistente_id)}
                                              className={`text-white text-xs px-4 py-3 rounded ${colorMap[respuesta]} transition-colors rounded-lg`}
                                            >
                                              {respuesta.charAt(0).toUpperCase() + respuesta.slice(1)}
                                            </button>
                                          )
                                        })}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {tiempoRestante === 0 && usuariosSinVotar.length === 0
                          ? (
                            <div className='flex flex-wrap md:flex-nowrap justify-between gap-4'>
                              <GraficoTorta votos={usuariosQueVotaron} noVotaron={usuariosSinVotar} />
                              <GraficoLinea votos={usuariosQueVotaron} duracion={20} inicio={inicioVotacion} />
                            </div>
                            )
                          : (
                            <GraficoLinea votos={usuariosQueVotaron} duracion={20} inicio={inicioVotacion} />
                            )}
                      </>
                    )}
                  </div>
                )
              })()
            )
          : (
            <p className='text-gray-600 dark:text-white text-center'>No hay votaciones disponibles.</p>
            )}
      </div>
    </>
  )
}
