import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import DatosPersonalesData from '@/components/forms/DatosPersonalesData'
import Loading from '@/components/Loading'
import Button from '@/components/ui/Button'
import FormacionProfesionalData from '@/components/forms/FormacionProfesionalData'
import { toast } from 'react-toastify'

export const Create = () => {
  const { id } = useParams()
  const [formacionesCount, setFormacionesCount] = useState(0)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isParamsLoading] = useState(true)
  const { activeAfiliado, startSavingAfiliado, startUpdateAfiliado, startEditAfiliado, paginate } = useAfiliadoStore()
  const { user } = useSelector((state) => state.auth)
  const currentPage = paginate?.current_page || 1

  const FormValidationSchema = yup.object().shape({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    dni: yup.string().required('El DNI es requerido')
  })

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  })

  const onSubmit = async (data) => {
    if (formacionesCount === 0) {
      toast.error('Debes agregar al menos una formación profesional antes de guardar.')
      return
    }
    if (!activeAfiliado) {
      await startSavingAfiliado(data)
    } else {
      await startUpdateAfiliado(activeAfiliado.persona.id)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        if (id) {
          await startEditAfiliado(id)
        }
      } catch (error) {
        console.error('Error al cargar los datos del afiliado:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    if (!id) return setIsLoading(false)
    if (id && !isParamsLoading) {
      startEditAfiliado(id)
    }
  }, [isParamsLoading, id])

  useEffect(() => {
    if (activeAfiliado) {
      Object.entries(activeAfiliado).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [activeAfiliado, setValue])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {(user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) && (
              <div>
                <DatosPersonalesData register={register} errors={errors} setValue={setValue} watch={watch} isLoadingParent={isLoading} />

                <FormacionProfesionalData register={register} errors={errors} setValue={setValue} watch={watch} isLoadingParent={isLoading} onFormacionesChange={(arr) => setFormacionesCount(arr.length)} />
              </div>
            )}

            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button
                  className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                  onClick={() => navigate(`/alumnos?page=${currentPage}`)}
                >
                  Volver
                </button>
              </div>
              <div className='ltr:text-right rtl:text-left'>
                <Button
                  type='submit'
                  text={isSubmitting ? 'Guardando' : 'Guardar'}
                  className={`bg-green-500 ${
                  isSubmitting
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-green-700'
                } text-white items-center text-center py-2 px-6 rounded-lg`}
                  disabled={isSubmitting}
                  onClick={isSubmitting ? undefined : handleSubmit}
                />
              </div>
            </div>
          </form>
          )}
    </>
  )
}
