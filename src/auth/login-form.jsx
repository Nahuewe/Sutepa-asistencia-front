import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Textinput from '@/components/ui/Textinput'
import { useAuthStore } from '@/helpers'

function LoginForm () {
  const navigate = useNavigate()
  const { startLogin } = useAuthStore()

  const validateForm = (values) => {
    const errors = {}

    if (!values.legajo) {
      errors.legajo = 'El legajo es requerido'
    }

    return errors
  }

  const { formState: { errors }, handleSubmit, setValue, register } = useForm({
    defaultValues: {
      legajo: ''
    },
    resolver: async (data) => {
      const errors = validateForm(data)

      return {
        values: Object.keys(errors).length === 0 ? data : {},
        errors: Object.keys(errors).reduce((acc, key) => {
          acc[key] = { type: 'custom', message: errors[key] }
          return acc
        }, {})
      }
    }
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
      <button className='btn bg-indigo-600 hover:bg-indigo-800 block w-full text-center mt-2 text-white'>
        Iniciar Sesión
      </button>
    </form>
  )
}

export default LoginForm
