import Tooltip from '@/components/ui/Tooltip'
import React from 'react'

const EditButton = ({ evento, onEdit }) => {
  return (
    <Tooltip content='Editar' placement='top' arrow animation='shift-away'>
      <button
        className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700'
        onClick={() => onEdit(evento.id)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='icon icon-tabler icon-tabler-pencil'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          strokeWidth='2'
          stroke='currentColor'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
          <path d='M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4' />
          <path d='M13.5 6.5l4 4' />
        </svg>
      </button>
    </Tooltip>
  )
}

export default EditButton
