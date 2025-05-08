export const VotacionStatusTable = ({ usuariosQueVotaron, usuariosSinVotar }) => {
  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Tipo de voto
            </th>
            <th scope='col' className='px-6 py-3'>
              Afiliados
            </th>
            <th scope='col' className='px-6 py-3 text-right'>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className='bg-green-200 dark:bg-green-900 dark:bg-opacity-20 dark:border-gray-700'>
            <th scope='row' className='px-6 py-4 font-medium text-green-700 dark:text-green-400 whitespace-nowrap'>
              Afirmativo
            </th>
            <td className='px-6 py-4'>
              <div className='flex flex-wrap gap-2'>
                {usuariosQueVotaron
                  .filter(usuario => usuario.respuesta === 'afirmativo')
                  .map(usuario => (
                    <span
                      key={usuario.asistente_id}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-300 text-green-950 dark:bg-green-900 dark:text-green-200'
                    >
                      {usuario.apellido}, {usuario.nombre}
                    </span>
                  ))}
              </div>
            </td>
            <td className='px-6 py-4 text-right font-bold text-green-700 dark:text-green-400'>
              {usuariosQueVotaron.filter(usuario => usuario.respuesta === 'afirmativo').length}
            </td>
          </tr>

          <tr className='bg-red-200 dark:bg-red-900 dark:bg-opacity-20 dark:border-gray-700'>
            <th scope='row' className='px-6 py-4 font-medium text-red-700 dark:text-red-400 whitespace-nowrap'>
              Negativo
            </th>
            <td className='px-6 py-4'>
              <div className='flex flex-wrap gap-2'>
                {usuariosQueVotaron
                  .filter(usuario => usuario.respuesta === 'negativo')
                  .map(usuario => (
                    <span
                      key={usuario.asistente_id}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-300 text-red-950 dark:bg-red-900 dark:text-red-200'
                    >
                      {usuario.apellido}, {usuario.nombre}
                    </span>
                  ))}
              </div>
            </td>
            <td className='px-6 py-4 text-right font-bold text-red-700 dark:text-red-400'>
              {usuariosQueVotaron.filter(usuario => usuario.respuesta === 'negativo').length}
            </td>
          </tr>

          <tr className='bg-cyan-200 dark:bg-cyan-900 dark:bg-opacity-20 dark:border-gray-700'>
            <th scope='row' className='px-6 py-4 font-medium text-cyan-700 dark:text-cyan-400 whitespace-nowrap'>
              Abstención
            </th>
            <td className='px-6 py-4'>
              <div className='flex flex-wrap gap-2'>
                {usuariosQueVotaron
                  .filter(usuario => usuario.respuesta === 'abstencion')
                  .map(usuario => (
                    <span
                      key={usuario.asistente_id}
                      className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-300 text-cyan-950 dark:bg-cyan-900 dark:text-cyan-200'
                    >
                      {usuario.apellido}, {usuario.nombre}
                    </span>
                  ))}
              </div>
            </td>
            <td className='px-6 py-4 text-right font-bold text-cyan-700 dark:text-cyan-400'>
              {usuariosQueVotaron.filter(usuario => usuario.respuesta === 'abstencion').length}
            </td>
          </tr>

          <tr className='bg-gray-300 dark:bg-gray-700'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap'>
              No votaron
            </th>
            <td className='px-6 py-4'>
              <div className='flex flex-wrap gap-2'>
                {usuariosSinVotar.map(usuario => (
                  <span
                    key={usuario.asistente_id}
                    className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-300'
                  >
                    {usuario.apellido}, {usuario.nombre}
                  </span>
                ))}
              </div>
            </td>
            <td className='px-6 py-4 text-right font-bold text-gray-700 dark:text-gray-400'>
              {usuariosSinVotar.length}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
