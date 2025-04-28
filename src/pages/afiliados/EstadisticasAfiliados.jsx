import React, { useMemo } from 'react'
import Icon from '@/components/ui/Icon'

const EstadisticasAfiliados = ({ afiliadosSinPaginar }) => {
  const countAfiliadosPorEstado = (data) => {
    const totals = {
      totales: data.length,
      activos: data.filter(a => a.estado === 'ACTIVO').length,
      inactivos: data.filter(a => a.estado === 'INACTIVO').length
    }
    return totals
  }

  const countFormaciones = (data) => {
    const formacionCount = {}

    if (!Array.isArray(data)) return formacionCount // o lanzar un error

    data.forEach(afiliado => {
      if (afiliado.formacion && Array.isArray(afiliado.formacion)) {
        afiliado.formacion.forEach(formacion => {
          if (formacionCount[formacion.formacion]) {
            formacionCount[formacion.formacion]++
          } else {
            formacionCount[formacion.formacion] = 1
          }
        })
      }
    })

    // Encontrar la formación más popular
    let maxCount = 0
    let popularFormacion = null

    Object.entries(formacionCount).forEach(([formacion, count]) => {
      if (count > maxCount) {
        maxCount = count
        popularFormacion = formacion
      }
    })

    return {
      popularFormacion,
      totalAlumnos: maxCount
    }
  }

  const totalsByEstado = useMemo(() => countAfiliadosPorEstado(afiliadosSinPaginar), [afiliadosSinPaginar])
  const { popularFormacion, totalAlumnos } = useMemo(() => countFormaciones(afiliadosSinPaginar), [afiliadosSinPaginar])

  const statistics = [
    {
      title: 'Alumnos Totales',
      count: totalsByEstado.totales || 0,
      bg: 'bg-info-500',
      text: 'text-info-500',
      icon: 'heroicons-solid:user-group'
    },
    {
      title: 'Alumnos Activos',
      count: totalsByEstado.activos || 0,
      bg: 'bg-success-500',
      text: 'text-success-500',
      icon: 'heroicons-solid:user-plus'
    },
    {
      title: 'Alumnos Inactivos',
      count: totalsByEstado.inactivos || 0,
      bg: 'bg-danger-500',
      text: 'text-danger-500',
      icon: 'heroicons-solid:user-remove'
    },
    {
      title: 'Formación Más Cursada',
      count: popularFormacion ? `${popularFormacion.toUpperCase()} (${totalAlumnos})` : 'No hay formaciones',
      bg: 'bg-warning-500',
      text: 'text-warning-500',
      icon: 'heroicons-solid:star'
    }
  ]

  return (
    <>
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg} rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
        >
          <div
            className={`${item.text} mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4`}
          >
            <Icon icon={item.icon} />
          </div>
          <span className='block text-sm text-slate-600 font-medium dark:text-white mb-1'>
            {item.title}
          </span>
          <span className='block mb- text-2xl text-slate-900 dark:text-white font-medium'>
            {item.count}
          </span>
        </div>
      ))}
    </>
  )
}

export default EstadisticasAfiliados
