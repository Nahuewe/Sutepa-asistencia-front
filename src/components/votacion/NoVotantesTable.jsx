import { useState } from 'react'

export const NoVotantesTable = ({ usuariosSinVotar, votacionId, onVoto, disabled }) => {
  const [votandoId, setVotandoId] = useState(null)
  const [usuariosVotados, setUsuariosVotados] = useState([])

  const handleVoto = async (respuesta, asistenteId) => {
    setVotandoId(asistenteId)
    try {
      await onVoto(votacionId, respuesta, asistenteId)
      setUsuariosVotados((prev) => [...prev, asistenteId])
    } finally {
      setVotandoId(null)
    }
  }

  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left text-gray-700 dark:text-gray-300'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th className='px-4 py-2'>Nombre</th>
            <th className='px-4 py-2'>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuariosSinVotar.map(usuario => {
            const yaVoto = usuariosVotados.includes(usuario.asistente_id)

            return (
              <tr
                key={usuario.asistente_id}
                className='bg-gray-50 dark:bg-gray-900 dark:bg-opacity-20 dark:border-gray-700 text-black dark:text-white'
              >
                <td className='px-4 py-2'>
                  {usuario.apellido}, {usuario.nombre}
                </td>
                <td className='px-4 py-2 flex flex-wrap gap-2 items-center'>
                  {['afirmativo', 'negativo', 'abstencion'].map(respuesta => {
                    const colorMap = {
                      afirmativo: 'bg-green-600 hover:bg-green-700',
                      negativo: 'bg-red-600 hover:bg-red-700',
                      abstencion: 'bg-cyan-600 hover:bg-cyan-700'
                    }

                    const isDisabled =
                      disabled || votandoId !== null || yaVoto

                    return (
                      <button
                        key={respuesta}
                        onClick={() => handleVoto(respuesta, usuario.asistente_id)}
                        className={`text-white text-xs px-4 py-3 rounded ${colorMap[respuesta]} transition-colors rounded-lg
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={disabled}
                      >
                        {respuesta.charAt(0).toUpperCase() + respuesta.slice(1)}
                      </button>
                    )
                  })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
