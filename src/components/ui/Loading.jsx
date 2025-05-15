import LogoSutepa from '@/assets/images/logo/logo-sutepa.webp'

const Loading = () => {
  return (
    <div
      className='flex flex-col items-center justify-center app_height'
      role='status'
      aria-label='Cargando contenido, por favor espere'
    >
      <img
        src={LogoSutepa}
        alt='Logo Sutepa'
        className='h-16 w-56 mb-4 animate-bounce-smooth opacity-90'
      />
      <span className='inline-block mt-1 font-medium text-sm text-gray-600 dark:text-gray-400'>
        Cargando...
      </span>
      <div className='mt-2 flex space-x-2'>
        <div className='h-3 w-3 rounded-full bg-blue-500 animate-bounce-dot delay-0' />
        <div className='h-3 w-3 rounded-full bg-blue-500 animate-bounce-dot delay-150' />
        <div className='h-3 w-3 rounded-full bg-blue-500 animate-bounce-dot delay-300' />
      </div>
    </div>
  )
}

export default Loading
