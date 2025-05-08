export const ResultadoGanador = ({ resultadoGanador, usuariosQueVotaron }) => {
  const totalVotantes = usuariosQueVotaron.filter((asistente) => asistente.ya_voto).length

  const conteo = {
    afirmativo: 0,
    negativo: 0,
    abstencion: 0
  }

  usuariosQueVotaron.forEach((asistente) => {
    if (asistente.ya_voto && Object.prototype.hasOwnProperty.call(conteo, asistente.respuesta)) {
      conteo[asistente.respuesta]++
    }
  })

  const valores = Object.values(conteo)
  const maxVotos = Math.max(...valores)
  const respuestasMaximas = Object.keys(conteo).filter((key) => conteo[key] === maxVotos)

  const esEmpate = respuestasMaximas.length > 1
  const respuestaGanadora = esEmpate ? null : respuestasMaximas[0]
  const votosGanadores = esEmpate ? maxVotos : conteo[respuestaGanadora]

  const bgColor = {
    afirmativo: 'bg-green-100 dark:bg-green-900',
    negativo: 'bg-red-100 dark:bg-red-900',
    abstencion: 'bg-blue-100 dark:bg-blue-900'
  }

  const textColor = {
    afirmativo: 'text-green-800 dark:text-green-200',
    negativo: 'text-red-800 dark:text-red-200',
    abstencion: 'text-blue-800 dark:text-blue-200'
  }

  const subTextColor = {
    afirmativo: 'text-green-700 dark:text-green-300',
    negativo: 'text-red-700 dark:text-red-300',
    abstencion: 'text-blue-700 dark:text-blue-300'
  }

  return (
    <div
      className={`text-center mt-6 p-8 rounded-2xl shadow-lg ${
        respuestaGanadora ? bgColor[respuestaGanadora] : 'bg-gray-50 dark:bg-gray-700'
      }`}
    >
      <h2
        className={`text-3xl font-extrabold uppercase tracking-wide ${
          respuestaGanadora ? textColor[respuestaGanadora] : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        Resultado: {esEmpate ? 'EMPATE' : respuestaGanadora.toUpperCase()}
      </h2>
      <p
        className={`text-xl mt-2 ${
          respuestaGanadora ? subTextColor[respuestaGanadora] : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        Con {votosGanadores} voto{votosGanadores !== 1 ? 's' : ''} de {totalVotantes}
      </p>
    </div>
  )
}
