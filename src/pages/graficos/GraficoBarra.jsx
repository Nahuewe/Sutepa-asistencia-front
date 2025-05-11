import { BarChart } from '@mui/x-charts'
import { useEffect, useState } from 'react'
import { getCantidadVotos, getVotacion } from '@/services/votacionService'

const barParams = {
  grid: { vertical: false, stroke: '#555' },
  legend: { hidden: false },
  hideLegend: true
}

const getBarSize = () =>
  window.innerWidth < 768
    ? { height: 250, width: 350 }
    : { height: 350, width: 850 }

export const GraficoBarra = () => {
  const [chartData, setChartData] = useState({
    afirmativo: [],
    negativo: [],
    abstencion: [],
    labels: []
  })

  const fetchResultados = async () => {
    try {
      const { data: votaciones } = await getVotacion()

      if (!votaciones || votaciones.length === 0) {
        setChartData({ afirmativo: [], negativo: [], abstencion: [], labels: [] })
        return
      }

      const respuestasData = await Promise.all(
        votaciones.map(async (v) => {
          const respuestas = await getCantidadVotos(v.id)

          const label = `${v?.tipo} - ${v?.identificador}`

          const conteo = respuestas?.reduce(
            (acc, r) => {
              if (r && typeof r.respuesta === 'string') {
                const tipo = r.respuesta.toLowerCase()
                acc[tipo] = (acc[tipo] || 0) + 1
              }
              return acc
            },
            { afirmativo: 0, negativo: 0, abstencion: 0 }
          )

          return {
            label,
            afirmativo: conteo?.afirmativo || 0,
            negativo: conteo?.negativo || 0,
            abstencion: conteo?.abstencion || 0
          }
        })
      )

      const labels = respuestasData.map((r) => r.label)
      const afirmativo = respuestasData.map((r) => r.afirmativo)
      const negativo = respuestasData.map((r) => r.negativo)
      const abstencion = respuestasData.map((r) => r.abstencion)

      setChartData({ afirmativo, negativo, abstencion, labels })
    } catch (error) {
      console.error('Error al obtener los resultados:', error)
    }
  }

  useEffect(() => {
    fetchResultados()
  }, [])

  const { afirmativo, negativo, abstencion, labels } = chartData

  if (labels.length === 0) {
    return (
      <div className='bg-gray-50 dark:bg-gray-700 shadow-lg rounded-2xl p-8 text-center w-full'>
        <h3 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>Resultados Anteriores</h3>
        <p className='text-gray-600 dark:text-gray-300'>No hay datos de votaciones para mostrar o se están cargando.</p>
      </div>
    )
  }

  return (
    <div className='bg-gray-50 dark:bg-gray-700 shadow-lg rounded-2xl p-8'>
      <h3 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center'>Resultados Anteriores</h3>
      <div className='overflow-x-auto w-full'>
        <BarChart
          xAxis={[
            {
              id: 'votaciones',
              data: labels,
              scaleType: 'band',
              tickLabelStyle: {
                transform: 'rotate(-30deg)',
                textAnchor: 'end',
                fontSize: '0.75rem'
              }
            }
          ]}
          yAxis={[
            {
              scaleType: 'linear',
              valueFormatter: (value) => Math.round(value).toString()
            }
          ]}
          series={[
            {
              label: 'Afirmativo',
              data: afirmativo,
              color: '#22c55e'
            },
            {
              label: 'Negativo',
              data: negativo,
              color: '#ef4444'
            },
            {
              label: 'Abstención',
              data: abstencion,
              color: '#06b6d4'
            }
          ]}
          {...barParams}
          {...getBarSize()}
        />
      </div>
    </div>
  )
}
