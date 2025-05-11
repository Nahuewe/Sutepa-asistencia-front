import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ExportButton from '@/components/buttons/ExportButton'
import Loading from '@/components/ui/Loading'
import { UltimaVotacion } from '@/components/votacion/UltimaVotacion'
import { descargarVotacionesExcel, descargarVotosExcel } from '@/export/exportarArchivos'
import { getVotacion, createVoto, verificarVotoUsuario, getCantidadVotos, getUsuariosNoVotaron } from '@/services/votacionService'

const DURACION_VOTACION = 20

export const Votaciones = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [respuestaVotada, setRespuestaVotada] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inicioVotacion, setInicioVotacion] = useState(Date.now())
  const [tiempoRestante, setTiempoRestante] = useState(DURACION_VOTACION)
  const [votando, setVotando] = useState(false)

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
    enabled: !!ultimaVotacion?.id
  })

  const resultadoGanador = useMemo(() => {
    if (!usuariosQueVotaron?.length) return null

    const conteo = usuariosQueVotaron.reduce((acc, voto) => {
      acc[voto.respuesta] = (acc[voto.respuesta] || 0) + 1
      return acc
    }, {})

    const [respuesta, cantidad] = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0] || []
    return { respuesta, cantidad }
  }, [usuariosQueVotaron])

  const { data: usuariosSinVotar = [] } = useQuery({
    queryKey: ['sinVotar', ultimaVotacion?.id],
    queryFn: async () => {
      if (!ultimaVotacion) return []
      const raw = await getUsuariosNoVotaron(ultimaVotacion.id)
      return raw.map((usuario) => ({ ...usuario, id: usuario.asistente_id }))
    },
    enabled: !!ultimaVotacion?.id
  })

  const yaVoto = verificacionData?.ya_voto || false

  const handleVoto = async (votacionId, respuesta, asistenteId = user.id) => {
    if (asistenteId === user.id && yaVoto) {
      return toast.error('Ya has votado en esta votación.')
    }

    try {
      setVotando(true)
      await createVoto({ votacion_id: votacionId, respuesta, asistente_id: asistenteId })
      setRespuestaVotada(respuesta)
      invalidarVotacion(votacionId)
    } catch (error) {
      toast.error('Ocurrió un error al registrar el voto.')
    } finally {
      setVotando(false)
    }
  }

  useEffect(() => {
    if (!yaVoto || respuestaVotada) return

    const votoUsuario = usuariosQueVotaron.find((usuario) => usuario.asistente_id === user.id)
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
        <div className='flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 mb-4'>
          <h1 className='text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white'>
            Listado de Votaciones
          </h1>
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
            {user.roles_id === 1 && (
              <>
                <ExportButton
                  descargaFn={descargarVotacionesExcel}
                  nombreArchivo='Votaciones'
                  textoBoton='Exportar Votaciones'
                  textoExportando='Exportando Votaciones...'
                />
                <ExportButton
                  descargaFn={descargarVotosExcel}
                  nombreArchivo='Votos'
                  textoBoton='Exportar Votos'
                  textoExportando='Exportando Votos...'
                  colors={{ normal: 'bg-yellow-600 hover:bg-yellow-800', exporting: 'bg-red-500 hover:bg-red-600' }}
                />
              </>
            )}
            <button
              onClick={addVotacion}
              className='bg-indigo-600 hover:bg-indigo-800 text-white items-center text-center py-2 px-6 rounded-lg'
            >
              Crear Votacion
            </button>
          </div>
        </div>
      )}

      <div className='space-y-6'>
        {votaciones?.data?.length > 0
          ? (
            <UltimaVotacion
              votacion={ultimaVotacion}
              yaVoto={yaVoto}
              tiempoRestante={tiempoRestante}
              user={user}
              handleVoto={handleVoto}
              respuestaVotada={respuestaVotada}
              votando={votando}
              usuariosQueVotaron={usuariosQueVotaron}
              usuariosSinVotar={usuariosSinVotar}
              resultadoGanador={resultadoGanador}
              inicioVotacion={inicioVotacion}
              duracionVotacion={DURACION_VOTACION}
            />
            )
          : (
            <p className='text-gray-600 dark:text-white text-center'>No hay votaciones disponibles.</p>
            )}
      </div>
    </>
  )
}
