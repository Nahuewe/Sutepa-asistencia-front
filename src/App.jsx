import React, { lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './helpers/useAuthStore'
import { Users } from './pages'
import Layout from './layout/Layout'
import Login from './pages/auth/Login'
import Error from './pages/404'
import Loading from '@/components/Loading'
const Dashboard = lazy(() => import('./pages/dashboard'))

function App () {
  const { status, checkAuthToken } = useAuthStore()

  useEffect(() => {
    checkAuthToken()
  }, [])

  if (status === 'checking') {
    return (
      <Loading />
    )
  }

  return (
    <main className='App relative'>
      <Routes>
        {
          (status === 'not-authenticated')
            ? (
              <>
                {/* Login */}
                <Route path='/login' element={<Login />} />
                <Route path='/*' element={<Navigate to='/login' />} />
              </>
              )
            : (
              <>
                <Route path='/' element={<Navigate to='/usuarios' />} />

                <Route path='/*' element={<Layout />}>
                  <Route path='dashboard' element={<Dashboard />} />
                  <Route path='*' element={<Navigate to='/404' />} />

                  <Route path='usuarios' element={<Users />} />
                </Route>

                <Route path='*' element={<Navigate to='/404' />} />
                <Route path='/404' element={<Error />} />
              </>
              )
        }
      </Routes>
    </main>
  )
}

export default App
