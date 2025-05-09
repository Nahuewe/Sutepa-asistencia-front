import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import QRScanner from '@/components/QR/QRscanner'
import Loading from '@/components/ui/Loading'
import { useAuthStore } from '@/helpers/useAuthStore'
import Layout from '@/layout/Layout'
import Error from '@/pages/404'
import Login from '@/pages/auth/Login'
import { CreateVotaciones } from '@/pages/congreso/CreateVotaciones'
import { Votaciones } from '@/pages/congreso/Votaciones'
import { Egreso } from '@/pages/gestion/Egreso'
import { Ingreso } from '@/pages/gestion/Ingreso'
import { CreateOrdenesDiarias } from '@/pages/ordenes_diarias/CreateOrdenesDiarias'
import { OrdenesDiarias } from '@/pages/ordenes_diarias/OrdenesDiarias'
import { CreateUser } from '@/pages/users/CreateUser'
import { Users } from '@/pages/users/Users'

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
                <Route path='/' element={<Navigate to='/votaciones' />} />

                <Route path='/*' element={<Layout />}>
                  <Route path='*' element={<Navigate to='/404' />} />

                  {/* Votacion */}
                  <Route path='votaciones' element={<Votaciones />} />
                  <Route path='votaciones/crear' element={<CreateVotaciones />} />

                  {/* Gestion */}
                  <Route path='ingreso' element={<Ingreso />} />
                  <Route path='egreso' element={<Egreso />} />
                  <Route path='QR/ingreso' element={<QRScanner tipo='ingreso' />} />
                  <Route path='QR/egreso' element={<QRScanner tipo='egreso' />} />

                  {/* Asistentes */}
                  <Route path='asistentes' element={<Users />} />
                  <Route path='asistentes/crear' element={<CreateUser />} />
                  <Route path='asistentes/editar/:id' element={<CreateUser />} />

                  {/* Ordenes Diarias */}
                  <Route path='ordenes-diarias' element={<OrdenesDiarias />} />
                  <Route path='ordenes-diarias/crear' element={<CreateOrdenesDiarias />} />
                  <Route path='ordenes-diarias/editar/:id' element={<CreateOrdenesDiarias />} />
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
