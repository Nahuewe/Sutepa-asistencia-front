import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Loading from '@/components/Loading'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
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
            <Card title='SUTEPA'>
              <div className='flex justify-between'>
                <p className='text-lg mx-0 my-auto hidden md:flex'>Dashboard</p>
              </div>
            </Card>

            {/* <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4'>
              <EstadisticasDashboard
                afiliadosSinPaginar={afiliadosSinPaginar}
              />
            </div>

            <div className='mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4'>
              <DonutChart afiliadosSinPaginar={afiliadosSinPaginar} />
              <RevenueBarChart afiliadosSinPaginar={afiliadosSinPaginar} />
            </div> */}
          </div>
          )}
    </>
  )
}

export default Dashboard
