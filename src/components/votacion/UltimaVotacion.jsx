import { useEffect, useRef } from 'react'
import { VotoButton } from '@/components/buttons/VotoButton'
import { NoVotantesTable } from '@/components/votacion/NoVotantesTable'
import { ResultadoGanador } from '@/components/votacion/ResultadoGanador'
import { TiempoRestante } from '@/components/votacion/TiempoRestante'
import { VotacionStatusTable } from '@/components/votacion/VotacionStatusTable'
import { VotoUsuario } from '@/components/votacion/VotoUsuario'
import { GraficoBarra } from '@/pages/graficos/GraficoBarra'
import { GraficoTorta } from '@/pages/graficos/GraficoTorta'

export const UltimaVotacion = ({
  votacion,
  yaVoto,
  tiempoRestante,
  user,
  handleVoto,
  respuestaVotada,
  votando,
  usuariosQueVotaron,
  usuariosSinVotar,
  resultadoGanador
  // inicioVotacion,
  // duracionVotacion
}) => {
  const graficosRef = useRef(null)

  useEffect(() => {
    if (tiempoRestante === 0 && usuariosSinVotar.length === 0 && graficosRef.current) {
      graficosRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [tiempoRestante, usuariosSinVotar])

  if (!votacion || votacion.tipo === 'CIERRE DEL DÍA') {
    return null
  }

  return (
    <div key={votacion.id} className='p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 space-y-6'>
      <div className='space-y-1 ml-1'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{votacion.tipo} - {votacion.identificador}</h2>
        {[1, 2].includes(user.roles_id) && (
          <p className='text-gray-600 dark:text-gray-300'>{votacion.contenido}</p>
        )}
      </div>

      {tiempoRestante !== null && tiempoRestante > 0 && (
        <TiempoRestante tiempo={tiempoRestante} />
      )}

      {tiempoRestante > 0 && !yaVoto && (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <VotoButton
            texto='Afirmativo'
            color='bg-green-600 hover:bg-green-700'
            onClick={() => handleVoto(votacion.id, 'afirmativo')}
            disabled={!!respuestaVotada || votando}
          />
          <VotoButton
            texto='Negativo'
            color='bg-red-600 hover:bg-red-700'
            onClick={() => handleVoto(votacion.id, 'negativo')}
            disabled={!!respuestaVotada || votando}
          />
          <VotoButton
            texto='Abstenerse'
            color='bg-cyan-500 hover:bg-cyan-600'
            onClick={() => handleVoto(votacion.id, 'abstencion')}
            disabled={!!respuestaVotada || votando}
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
                votacionId={votacion.id}
                onVoto={handleVoto}
                disabled={votando}
              />
            </div>
          )}
          {tiempoRestante === 0 && resultadoGanador && usuariosSinVotar.length === 0 && (
            <ResultadoGanador resultadoGanador={resultadoGanador} usuariosQueVotaron={usuariosQueVotaron} />
          )}
          {tiempoRestante === 0 && usuariosSinVotar.length === 0 && (
            <div ref={graficosRef} className='flex flex-wrap md:flex-nowrap justify-between gap-4'>
              <GraficoTorta votos={usuariosQueVotaron} noVotaron={usuariosSinVotar} />
              {/* <GraficoLinea votos={usuariosQueVotaron} duracion={duracionVotacion} inicio={inicioVotacion} /> */}
              <GraficoBarra votos={usuariosQueVotaron} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
