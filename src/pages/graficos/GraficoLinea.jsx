/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from 'react'
import { LineChart } from '@mui/x-charts'
import Loading from '@/components/ui/Loading'

const lineParams = {
  height: 350,
  margin: { left: 30, right: 30, top: 20, bottom: 30 },
  grid: { vertical: true, horizontal: true, stroke: '#555' },
  tooltip: { show: true },
  point: { show: true, fill: '#4f46e5', radius: 4 }
}

const getLineSize = () =>
  window.innerWidth < 768
    ? { height: 250 }
    : { height: 350 }

export const GraficoLinea = ({ votos, duracion = 20, inicio }) => {
  if (!votos) return <Loading />

  const evolucion = useMemo(() => {
    const startTs = inicio ?? (Date.now() - duracion * 1000)
    const counts = Array.from({ length: duracion + 1 }, (_, i) => ({
      segundo: i,
      votos: 0
    }))

    votos.forEach(voto => {
      const ts = new Date(voto.created_at).getTime()
      const offset = Math.floor((ts - startTs) / 1000)
      if (offset >= 0 && offset <= duracion) {
        counts[offset].votos += 1
      }
    })

    return counts
  }, [votos, duracion, inicio])

  return (
    <div className='w-full bg-gray-50 dark:bg-gray-700 shadow-lg rounded-2xl p-8'>
      <LineChart
        dataset={evolucion}
        xAxis={[{ scaleType: 'point', dataKey: 'segundo' }]}
        series={[{
          dataKey: 'votos',
          label: 'Votos por Segundo',
          valueFormatter: v => `${v}`,
          curve: 'step',
          color: '#4f46e5'
        }]}
        {...lineParams}
        {...getLineSize()}
      />
    </div>
  )
}
