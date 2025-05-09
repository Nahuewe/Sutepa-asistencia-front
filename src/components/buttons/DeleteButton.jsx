/* eslint-disable react/no-children-prop */
import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Tooltip from '@/components/ui/Tooltip'

const DeleteButton = ({ evento, onDelete, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsLoading(false)
    setIsModalOpen(false)
  }

  const confirmReject = async () => {
    setIsLoading(true)
    try {
      await onDelete(evento.id)
      await refetch()
      handleCloseModal()
    } catch (error) {
      console.error('Error al eliminar:', error)
      setIsLoading(false)
    }
  }

  return (
    <>
      <Tooltip content='Eliminar' placement='top' arrow animation='shift-away'>
        <button
          className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 transition-colors duration-200'
          onClick={handleOpenModal}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='icon icon-tabler icon-tabler-trash'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <path d='M4 7h16' />
            <path d='M10 11v6' />
            <path d='M14 11v6' />
            <path d='M5 7l1 12a1 1 0 0 0 1 1h10a1 1 0 0 0 1 -1l1 -12' />
            <path d='M9 7V4a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
          </svg>
        </button>
      </Tooltip>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title='Eliminar Contenido'
        labelClass='bg-red-600 hover:bg-red-800 text-white items-center text-center py-2 px-6 rounded-lg transition-colors duration-200'
        centered
        children={
          <div className='p-4 text-gray-700 dark:text-white'>
            <h2 className='text-xl font-semibold mb-2 text-center text-red-600 dark:text-red-500'>
              Confirmación de Eliminación
            </h2>
            <p className='text-center mb-6'>
              ¿Estás seguro de que deseas eliminar este contenido? Esta acción no se puede deshacer.
            </p>
            <div className='flex justify-center gap-4'>
              <button
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50'
                onClick={handleCloseModal}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                className='bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2'
                onClick={confirmReject}
                disabled={isLoading}
              >
                {isLoading
                  ? (
                    <>
                      <svg
                        className='animate-spin h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8v8H4z'
                        />
                      </svg>
                      Eliminando...
                    </>
                    )
                  : (
                      'Confirmar'
                    )}
              </button>
            </div>
          </div>
        }
      />
    </>
  )
}

export default DeleteButton
