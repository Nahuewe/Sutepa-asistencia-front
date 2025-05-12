export const TiempoRestante = ({ tiempo }) => (
  <div className='flex justify-center items-center my-4'>
    <p className='text-xl font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm'>
      Tiempo restante: <span className='text-blue-600 dark:text-blue-400'>{tiempo}s</span>
    </p>
  </div>
)
