import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import { useAuthStore } from '@/helpers'

const schema = yup
  .object({
    legajo: yup.string().required('El legajo es requerido')
  })
  .required()

function LoginForm () {
  const navigate = useNavigate()
  const { startLogin } = useAuthStore()
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    try {
      await startLogin(data)
      navigate('/')
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='relative space-y-2'>
      <div>
        <label htmlFor='default-picker' className='form-label text-white'>
          Legajo
        </label>
        <Textinput
          name='legajo'
          type='text'
          register={register}
          error={errors.legajo}
          className='h-[48px]'
          placeholder='Legajo'
          onChange={(e) => {
            setValue('legajo', e.target.value)
          }}
        />
      </div>

      <button className='btn bg-indigo-600 hover:bg-indigo-800 block w-full text-center mt-2 text-white'>Iniciar Sesión</button>
    </form>
  )
}

export default LoginForm
