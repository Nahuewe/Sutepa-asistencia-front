/* eslint-disable camelcase */
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getVotacion, createVoto, verificarVotoUsuario, getCantidadVotos, getUsuariosNoVotaron } from '@/services/votacionService'
import { descargarVotacionesExcel, descargarVotosExcel } from '@/export/ExportarArchivos'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { GraficoTorta } from '@/pages/graficos/GraficoTorta'
import { GraficoLinea } from '@/pages/graficos/GraficoLinea'
import { VotoUsuario } from '@/components/util/VotoUsuario'
import { VotacionStatusTable } from '@/components/util/VotacionStatusTable'
import { TiempoRestante } from '@/components/util/TiempoRestante'
import { VotoButton } from '@/components/buttons/VotoButton'
import { NoVotantesTable } from '@/components/util/NoVotantesTable'
import Loading from '@/components/ui/Loading'
import ExportButton from '@/components/buttons/ExportButton'

const DURACION_VOTACION = 23

export const Votaciones = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [respuestaVotada, setRespuestaVotada] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inicioVotacion, setInicioVotacion] = useState(Date.now())
  const [tiempoRestante, setTiempoRestante] = useState(DURACION_VOTACION)

  const invalidarVotacion = (id) => {
    queryClient.invalidateQueries({ queryKey: ['verificacion', id] })
    queryClient.invalidateQueries({ queryKey: ['usuariosVotaron', id] })
    queryClient.invalidateQueries({ queryKey: ['sinVotar', id] })
  }

  function addVotacion () {
    navigate('/votaciones/crear')
    queryClient.invalidateQueries({ queryKey: ['votaciones'] })
  }

  const { data: votaciones, refetch: refetchVotaciones } = useQuery({
    queryKey: ['votaciones'],
    queryFn: () => getVotacion(),
    keepPreviousData: true
  })

  const ultimaVotacion = useMemo(() => {
    if (!votaciones?.data?.length) return null
    return [...votaciones.data].sort(
      (a, b) => new Date(b.activa_hasta) - new Date(a.activa_hasta)
    )[0]
  }, [votaciones])

  const { data: verificacionData } = useQuery({
    queryKey: ['verificacion', ultimaVotacion?.id, user.id],
    queryFn: async () => {
      if (!ultimaVotacion) return { ya_voto: false }
      return verificarVotoUsuario({
        votacion_id: ultimaVotacion.id,
        asistente_id: user.id
      })
    },
    enabled: !!ultimaVotacion?.id
  })

  const { data: usuariosQueVotaron = [] } = useQuery({
    queryKey: ['usuariosVotaron', ultimaVotacion?.id],
    queryFn: () => getCantidadVotos(ultimaVotacion.id),
    enabled: !!ultimaVotacion?.id,
    refetchInterval: tiempoRestante > 0 ? 1000 : false
  })

  const { data: usuariosSinVotar = [] } = useQuery({
    queryKey: ['sinVotar', ultimaVotacion?.id],
    queryFn: async () => {
      if (!ultimaVotacion) return []
      const raw = await getUsuariosNoVotaron(ultimaVotacion.id)
      return raw.map(usuario => ({ ...usuario, id: usuario.asistente_id }))
    },
    enabled: !!ultimaVotacion?.id
  })

  const yaVoto = verificacionData?.ya_voto || false

  const handleVoto = async (votacionId, respuesta, asistenteId = user.id) => {
    if (asistenteId === user.id && yaVoto) {
      return toast.error('Ya has votado en esta votación.')
    }

    await createVoto({ votacion_id: votacionId, respuesta, asistente_id: asistenteId })
    setRespuestaVotada(respuesta)
    invalidarVotacion(votacionId)
  }

  useEffect(() => {
    if (!yaVoto || respuestaVotada) return

    const votoUsuario = usuariosQueVotaron.find(usuario => usuario.asistente_id === user.id)
    if (votoUsuario) {
      setRespuestaVotada(votoUsuario.respuesta)
    }
  }, [yaVoto, respuestaVotada, usuariosQueVotaron, user.id])

  useEffect(() => {
    if (!ultimaVotacion) return

    const activaHasta = new Date(ultimaVotacion.activa_hasta).getTime()
    const initialRemainingTime = Math.max(0, Math.floor((activaHasta - Date.now()) / 1000))
    setTiempoRestante(initialRemainingTime)

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((activaHasta - Date.now()) / 1000))
      setTiempoRestante(diff)

      if (diff === 0) {
        clearInterval(interval)
        invalidarVotacion(ultimaVotacion.id)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [ultimaVotacion, queryClient])

  useEffect(() => {
    const channel = window.Echo.channel('votacions')

    channel.listen('.nueva-votacion', () => {
      refetchVotaciones()
      toast.info('¡Se ha creado una nueva votación!')
    })

    channel.listen('.voto-registrado', (e) => {
      if (ultimaVotacion?.id === e.votacion.id) {
        invalidarVotacion(ultimaVotacion.id)
      }
    })

    return () => {
      window.Echo.channel('votacions').stopListening('.nueva-votacion')
      window.Echo.channel('votacions').stopListening('.voto-registrado')
      window.Echo.leave('votacions')
    }
  }, [ultimaVotacion?.id, refetchVotaciones])

  useEffect(() => {
    if (!ultimaVotacion) return
    setInicioVotacion(Date.now() - (DURACION_VOTACION - tiempoRestante) * 1000)
  }, [ultimaVotacion, tiempoRestante])

  useEffect(() => {
    setRespuestaVotada(null)
  }, [ultimaVotacion?.id])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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
                return (
                  <div key={ultimaVotacion.id} className='p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 space-y-6'>
                    <div className='space-y-1 ml-1'>
                      <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{ultimaVotacion.tipo} - {ultimaVotacion.identificador}</h2>
                      {[1, 2].includes(user.roles_id) && (
                        <p className='text-gray-600 dark:text-gray-300'>{ultimaVotacion.contenido}</p>
                      )}
                    </div>

                    {tiempoRestante > 0 && !yaVoto && (
                      <TiempoRestante tiempo={tiempoRestante} />
                    )}

                    {tiempoRestante > 0 && !yaVoto && (
                      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                        <VotoButton
                          texto='Afirmativo'
                          color='bg-green-600 hover:bg-green-700'
                          onClick={() => handleVoto(ultimaVotacion.id, 'afirmativo')}
                          disabled={!!respuestaVotada}
                        />
                        <VotoButton
                          texto='Negativo'
                          color='bg-red-600 hover:bg-red-700'
                          onClick={() => handleVoto(ultimaVotacion.id, 'negativo')}
                          disabled={!!respuestaVotada}
                        />
                        <VotoButton
                          texto='Abstenerse'
                          color='bg-cyan-500 hover:bg-cyan-600'
                          onClick={() => handleVoto(ultimaVotacion.id, 'abstencion')}
                          disabled={!!respuestaVotada}
                        />
                      </div>
                    )}

                    {respuestaVotada && [3, 4, 5].includes(user.roles_id) && (
                      <VotoUsuario respuesta={respuestaVotada} />
                    )}

                    {[1, 2].includes(user.roles_id) && (
                      <>
                        <h2 className='text-lg ml-1 font-semibold text-gray-800 dark:text-white mb-4'>Estado de la Votación</h2>

                        <VotacionStatusTable usuariosQueVotaron={usuariosQueVotaron} usuariosSinVotar={usuariosSinVotar} />

                        {tiempoRestante === 0 && usuariosSinVotar.length > 0 && (
                          <div>
                            <h3 className='text-lg ml-1 font-semibold text-gray-800 dark:text-white mb-4'>
                              Asignar votos a quienes no votaron
                            </h3>
                            <NoVotantesTable
                              usuariosSinVotar={usuariosSinVotar}
                              votacionId={ultimaVotacion.id}
                              onVoto={handleVoto}
                            />
                          </div>
                        )}

                        {tiempoRestante === 0 && usuariosSinVotar.length === 0
                          ? (
                            <div className='flex flex-wrap md:flex-nowrap justify-between gap-4'>
                              <GraficoTorta votos={usuariosQueVotaron} noVotaron={usuariosSinVotar} />
                              <GraficoLinea votos={usuariosQueVotaron} duracion={DURACION_VOTACION} inicio={inicioVotacion} />
                            </div>
                            )
                          : (
                            <GraficoLinea votos={usuariosQueVotaron} duracion={DURACION_VOTACION} inicio={inicioVotacion} />
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
