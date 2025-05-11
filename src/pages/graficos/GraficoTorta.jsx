import { PieChart, pieArcLabelClasses } from '@mui/x-charts'
import { useState } from 'react'
import Loading from '@/components/ui/Loading'

const pieParams = {
  slotProps: {
    legend: { hidden: true },
    hideLegend: true,
    tooltip: {
      trigger: 'item',
      className: 'custom-tooltip',
      sx: {
        color: 'white',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '0.875rem'
      }
    }
  }
}

const getPieSize = () =>
  window.innerWidth < 768
    ? { height: 250, width: 250 }
    : { height: 350, width: 500 }

const colorMap = {
  afirmativo: '#22c55e',
  negativo: '#ef4444',
  abstencion: '#06b6d4',
  'no votaron': '#374151'
}

export const GraficoTorta = ({ votos, noVotaron = [] }) => {
  const [isHidden] = useState(true)
  if (votos == null) return <Loading />

  const conteos = votos.reduce((acc, u) => {
    const key = u.respuesta.trim().toLowerCase()
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  if (noVotaron.length) conteos['no votaron'] = noVotaron.length

  const data = Object.entries(conteos).map(([label, value]) => ({ id: label, label, value }))

  if (data.length === 0) {
    return <div className='text-gray-500 text-center py-8'>No hay votos aún para mostrar.</div>
  }

  const sorted = [...data].sort((a, b) => b.value - a.value)
  const colors = sorted.map(d => colorMap[d.id] || '#999')

  return (
    <div className='bg-gray-50 dark:bg-gray-700 shadow-lg rounded-2xl p-8'>
      <h3 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center'>Resultados de la votación</h3>
      <div className='flex flex-col md:flex-row items-center'>
        <PieChart
          hideLegend={isHidden}
          series={[{
            data: sorted,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 50, additionalRadius: -50, color: 'rgba(0,0,0,0.1)' },
            valueFormatter: ({ value }) => `${value}`
          }]}
          colors={colors}
          sx={{ [`& .${pieArcLabelClasses.root}`]: { display: 'none' } }}
          {...pieParams}
          {...getPieSize()}
        />

        <ul className='mt-6 md:mt-0 md:ml-10 space-y-4'>
          {sorted.map((item, idx) => (
            <li key={item.id} className='flex items-center'>
              <span
                className='w-5 h-5 rounded-full'
                style={{ backgroundColor: colors[idx] }}
              />
              <span className='ml-3 text-lg font-medium text-gray-800 dark:text-gray-200'>
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}({item.value})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
