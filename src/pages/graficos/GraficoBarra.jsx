import { BarChart } from '@mui/x-charts'
import { useQuery } from '@tanstack/react-query'
import { getCantidadVotosMultiples, getVotacion } from '@/services/votacionService'

const barParams = {
  grid: { horizontal: true }
}

const getBarSize = () =>
  window.innerWidth < 768
    ? { height: 250, width: 270 }
    : { height: 350, width: 870 }

const fetchResultados = async () => {
  const { data: votaciones } = await getVotacion()

  if (!votaciones || votaciones.length === 0) {
    return {
      afirmativo: [],
      negativo: [],
      abstencion: [],
      labels: []
    }
  }

  const votacionesFiltradas = votaciones.filter(
    (v) => v.tipo?.toUpperCase() !== 'CIERRE DEL DÍA'
  )

  const ids = votacionesFiltradas.map((v) => v.id)
  const respuestas = await getCantidadVotosMultiples(ids)

  const resultados = votacionesFiltradas.map((v) => {
    const conteo = respuestas[v.id] || {
      afirmativo: 0,
      negativo: 0,
      abstencion: 0
    }

    return {
      label: `${v.tipo} - ${v.identificador}`,
      afirmativo: conteo.afirmativo,
      negativo: conteo.negativo,
      abstencion: conteo.abstencion
    }
  })

  return {
    afirmativo: resultados.map((r) => r.afirmativo),
    negativo: resultados.map((r) => r.negativo),
    abstencion: resultados.map((r) => r.abstencion),
    labels: resultados.map((r) => r.label)
  }
}

export const GraficoBarra = () => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['resultados-votacion'],
    queryFn: fetchResultados,
    keepPreviousData: true
  })

  if (isLoading || !chartData || chartData.labels.length === 0) {
    return (
      <div className='bg-gray-50 dark:bg-gray-700 shadow-lg rounded-2xl p-8 text-center w-full'>
        <h3 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>Resultados anteriores</h3>
        <p className='text-gray-600 dark:text-gray-300'>No hay datos de votaciones para mostrar o se están cargando.</p>
      </div>
    )
  }

  if (chartData.labels.length < 2) {
    return (
      <div className='bg-gray-50 dark:bg-gray-700 shadow-lg rounded-2xl p-8 text-center w-full'>
        <h3 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>Resultados anteriores</h3>
        <p className='text-gray-600 dark:text-gray-300'>Se necesitan al menos 2 votaciones para mostrar el gráfico.</p>
      </div>
    )
  }

  const { afirmativo, negativo, abstencion, labels } = chartData

  return (
    <div className='bg-gray-50 dark:bg-gray-700 shadow-lg rounded-2xl p-8'>
      <h3 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center'>Resultados anteriores</h3>
      <div className='overflow-x-auto w-full'>
        <BarChart
          xAxis={[{
            id: 'votaciones',
            data: labels
          }]}
          series={[
            { label: 'Afirmativo', data: afirmativo, color: '#22c55e' },
            { label: 'Negativo', data: negativo, color: '#ef4444' },
            { label: 'Abstención', data: abstencion, color: '#06b6d4' }
          ]}
          {...barParams}
          {...getBarSize()}
        />
      </div>
    </div>
  )
}
