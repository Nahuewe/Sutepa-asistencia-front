import React, { lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/helpers/useAuthStore'
import { Votaciones } from './pages/congreso/Votaciones'
import { Ingreso } from './pages/gestion/Ingreso'
import { Egreso } from './pages/gestion/Egreso'
import { Users } from '@/pages/users/Users'
import { CreateUser } from '@/pages/users/CreateUser'
import Layout from '@/layout/Layout'
import Login from '@/pages/auth/Login'
import Error from '@/pages/404'
import Loading from '@/components/ui/Loading'
import QRScanner from './components/QR/QRscanner'
const Dashboard = lazy(() => import('@/pages/dashboard'))

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
                <Route path='/' element={<Navigate to='/votacion' />} />

                <Route path='/*' element={<Layout />}>
                  <Route path='dashboard' element={<Dashboard />} />
                  <Route path='*' element={<Navigate to='/404' />} />

                  {/* Votacion */}
                  <Route path='votacion' element={<Votaciones />} />

                  {/* Gestion */}
                  <Route path='ingreso' element={<Ingreso />} />
                  <Route path='egreso' element={<Egreso />} />
                  <Route path='QR/ingreso' element={<QRScanner tipo='ingreso' />} />
                  <Route path='QR/egreso' element={<QRScanner tipo='egreso' />} />

                  {/* Asistentes */}
                  <Route path='asistentes' element={<Users />} />
                  <Route path='asistentes/crear' element={<CreateUser />} />
                  <Route path='asistentes/editar/:id' element={<CreateUser />} />
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
