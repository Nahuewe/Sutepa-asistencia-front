import React from 'react'
import { Link } from 'react-router-dom'
import Illustration from '@/assets/images/logo/logo-edja.png'
function Error () {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center text-center py-20 dark:bg-slate-900'>
      <img src={Illustration} alt='' className='pointer-events-none' />
      <div className='max-w-[546px] mx-auto w-full mt-12'>
        <h4 className='text-slate-900 mb-4'>
          Página no encontrada
        </h4>
        <div className='dark:text-white text-base font-normal mb-10'>
          Es posible que la página que está buscando haya sido eliminada debido a un cambio de nombre o no esté disponible temporalmente.
        </div>
      </div>
      <div className='max-w-[300px] mx-auto w-full'>
        <Link
          to='/'
          className='btn btn-dark dark:bg-slate-800 block text-center'
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default Error
