import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Loading from '@/components/ui/Loading'

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
          </div>
          )}
    </>
  )
}

export default Dashboard
