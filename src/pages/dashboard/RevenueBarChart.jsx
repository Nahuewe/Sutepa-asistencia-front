import React, { useRef, useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import useDarkMode from '@/hooks/useDarkMode'
import useRtl from '@/hooks/useRtl'
import Card from '@/components/ui/Card'

const RevenueBarChart = ({ afiliadosSinPaginar, height = 400 }) => {
  const chartRef = useRef(null)
  const [isDark] = useDarkMode()
  const [isRtl] = useRtl()
  const [series, setSeries] = useState([])
  const [totalData, setTotalData] = useState(0)
  const [activeSeries, setActiveSeries] = useState({})
  const generateColor = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      color += ('00' + ((hash >> (i * 8)) & 0xFF).toString(16)).slice(-2)
    }
    return color
  }

  const getBrightness = (hex) => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = rgb & 0xff
    return (r * 299 + g * 587 + b * 114) / 1000
  }

  const getTextColor = (backgroundColor) => {
    return getBrightness(backgroundColor) > 128 ? '#000000' : '#FFFFFF'
  }

  useEffect(() => {
    if (afiliadosSinPaginar) {
      const formaciones = {}

      afiliadosSinPaginar.forEach(afiliado => {
        const formacion = afiliado.formacion?.[0]?.formacion || 'Formación no Asignada'
        const estado = afiliado.estado || 'INACTIVO'

        if (!formaciones[formacion]) {
          formaciones[formacion] = { ACTIVO: 0, INACTIVO: 0 }
        }

        formaciones[formacion][estado] += 1
      })

      const totalAfiliados = afiliadosSinPaginar.length
      const seriesData = Object.keys(formaciones).map(formacion => ({
        name: formacion,
        data: [
          { x: 'ACTIVO', y: formaciones[formacion].ACTIVO },
          { x: 'INACTIVO', y: formaciones[formacion].INACTIVO }
        ],
        color: generateColor(formacion)
      }))

      setSeries(seriesData)
      setTotalData(totalAfiliados)

      const initialActiveSeries = {}
      seriesData.forEach((serie) => {
        initialActiveSeries[serie.name] = false
      })
      setActiveSeries(initialActiveSeries)
    }
  }, [afiliadosSinPaginar])

  const handleSeriesToggle = (formacion) => {
    setActiveSeries(prevState => ({
      ...prevState,
      [formacion]: !prevState[formacion]
    }))
  }

  const options = {
    chart: {
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        endingShape: 'rounded',
        columnWidth: '45%'
      }
    },
    title: {
      text: 'Alumnos Activos e Inactivos',
      align: 'left',
      offsetX: isRtl ? '0%' : 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '20px',
        fontWeight: '500',
        fontFamily: 'Inter',
        color: isDark ? '#fff' : '#0f172a'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: [isDark ? '#fefefe' : '#fefefe']
      },
      formatter: function (val, opts) {
        return `${val}`
      },
      offsetX: 0,
      offsetY: 0
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    yaxis: {
      opposite: !!isRtl,
      labels: {
        style: {
          colors: isDark ? '#CBD5E1' : '#475569',
          fontFamily: 'Inter'
        }
      }
    },
    xaxis: {
      categories: ['ACTIVOS', 'INACTIVOS'],
      labels: {
        style: {
          colors: isDark ? '#CBD5E1' : '#475569',
          fontFamily: 'Inter'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' Alumnos'
        }
      },
      theme: isDark ? 'dark' : 'light'
    },
    legend: {
      labels: {
        colors: isDark ? '#ffffff' : '#808080'
      },
      itemMargin: {
        horizontal: 10,
        vertical: 10
      }
    },
    colors: series.map(serie => serie.color),
    grid: {
      show: true,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      strokeDashArray: 10,
      position: 'back'
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: 'bottom',
            offsetY: 8,
            horizontalAlign: 'center'
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: 'center'
              }
            }
          }
        }
      }
    ]
  }

  const filteredSeries = series.filter(serie => activeSeries[serie.name])

  return (
    <Card>
      <div ref={chartRef}>
        <Chart options={options} series={filteredSeries} type='bar' height={height} />
        <div className={`btn ${isDark ? 'btn-dark' : 'btn-light'}`} style={{ textAlign: 'center' }}>Total de Alumnos: {totalData}</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {series.map((serie, index) => {
          const serieColor = serie.color
          const textColor = getTextColor(serieColor)
          return (
            <button
              key={serie.name}
              className='btn px-6 py-2 mx-2 my-2 rounded-lg transition duration-300 ease-in-out'
              style={{
                backgroundColor: activeSeries[serie.name] ? serieColor : '#E5E7EB',
                color: activeSeries[serie.name] ? textColor : '#374151'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = serieColor
                e.target.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = activeSeries[serie.name] ? serieColor : '#E5E7EB'
                e.target.style.color = activeSeries[serie.name] ? textColor : '#374151'
              }}
              onClick={() => handleSeriesToggle(serie.name)}
            >
              {serie.name}
            </button>
          )
        })}
      </div>
    </Card>
  )
}

export default RevenueBarChart
