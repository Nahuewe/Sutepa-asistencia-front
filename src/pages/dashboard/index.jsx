import React, { useEffect, useState } from 'react'
import { useAfiliadoStore, useDocenteStore } from '@/helpers'
import Card from '@/components/ui/Card'
import Loading from '@/components/Loading'
import EstadisticasDashboard from './EstadisticasDashboard'
import DonutChart from './DonutChart'
import RevenueBarChart from './RevenueBarChart'

const Dashboard = () => {
  const { afiliadosSinPaginar, startGetAfiliadosSinPaginar } = useAfiliadoStore()
  const { docentesSinPaginar, startGetDocenteSinPaginar } = useDocenteStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      await startGetAfiliadosSinPaginar()
      await startGetDocenteSinPaginar()
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div className='p-4'>
            <Card title='EDJA N°4'>
              <div className='flex justify-between'>
                <p className='text-lg mx-0 my-auto hidden md:flex'>Dashboard</p>
              </div>
            </Card>

            <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4'>
              <EstadisticasDashboard
                afiliadosSinPaginar={afiliadosSinPaginar}
                docentesSinPaginar={docentesSinPaginar}
              />
            </div>

            <div className='mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4'>
              <DonutChart afiliadosSinPaginar={afiliadosSinPaginar} />
              <RevenueBarChart afiliadosSinPaginar={afiliadosSinPaginar} />
            </div>
          </div>
          )}
    </>
  )
}

export default Dashboard
