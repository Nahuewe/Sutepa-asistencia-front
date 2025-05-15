import { useQuery } from '@tanstack/react-query'
import { Card } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import { SelectForm } from '@/components/ui/SelectForm'
import Textarea from '@/components/ui/Textarea'
import Textinput from '@/components/ui/Textinput'
import { getOrdenesDiarias } from '@/services/ordenesDiariasService'
import { createVotacion, getVotacionById } from '@/services/votacionService'

const tipos = [
  { id: 'ORDEN DEL DIA', nombre: 'ORDEN DEL DIA' },
  { id: 'MOCION', nombre: 'MOCION' },
  { id: 'CIERRE DEL DÍA', nombre: 'CIERRE DEL DÍA' }
]

export const CreateVotaciones = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage] = useState(initialPage)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [isCierreDelDia, setIsCierreDelDia] = useState(false)

  const { data: orden } = useQuery({
    queryKey: ['ordenDiaria', currentPage],
    queryFn: () => getOrdenesDiarias(currentPage),
    keepPreviousData: true
  })

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await createVotacion(data)
      navigate('/votaciones')
    } catch (error) {
      const responseErrors = error?.response?.data?.errors
      const errorMessage = responseErrors
        ? responseErrors[Object.keys(responseErrors)[0]][0]
        : error.message || 'Error desconocido'

      console.error('Error al crear la votación:', errorMessage)
      toast.error(`No se pudo crear la votación: ${errorMessage}`)
    }
  }

  const loadVotacion = async () => {
    setIsLoading(true)
    if (id) {
      try {
        const response = await getVotacionById(id)
        const votacion = response.data
        setValue('tipo', votacion.tipo)
        setValue('identificador', votacion.identificador)
        setValue('contenido', votacion.contenido)
      } catch (error) {
        console.error('Error al cargar la votación:', error)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (id) loadVotacion()
  }, [id])

  if (user.roles_id !== 1 && user.roles_id !== 2) {
    return <p className='text-red-600 font-semibold'>No tenés permisos para crear votaciones.</p>
  }

  return isLoading
    ? (
      <Loading />
      )
    : (
      <>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
              <label htmlFor='orden del dia' className='form-label block font-medium'>
                Seleccionar Orden del Día
              </label>
              <SelectForm
                name='orden del dia'
                className='w-full border border-gray-300 rounded-lg p-2'
                options={
                  orden?.data?.map(({ id, identificador, contenido }) => ({
                    id,
                    nombre: `${identificador} - ${contenido}`
                  })) || []
                }
                onChange={(e) => {
                  const seleccionada = orden?.data?.find(p => String(p.id) === e.target.value)
                  if (seleccionada) {
                    setValue('tipo', 'ORDEN DEL DIA')
                    setValue('identificador', seleccionada.identificador)
                    setValue('contenido', seleccionada.contenido)
                  }
                }}
              />
            </div>

            <div>
              <label htmlFor='tipo' className='form-label block font-medium'>
                Tipo de Votación <strong className='text-red-500'>(*)</strong>
              </label>
              <SelectForm
                name='tipo'
                className='w-full border border-gray-300 rounded-lg p-2'
                register={register('tipo')}
                options={tipos}
                placeholder='Seleccione una opción'
                error={errors.tipo}
                onChange={(e) => {
                  const tipoSeleccionado = e.target.value
                  setValue('tipo', tipoSeleccionado)
                  setIsCierreDelDia(tipoSeleccionado === 'CIERRE DEL DÍA')
                }}
              />
            </div>

            <div>
              <label htmlFor='identificador' className='form-label block font-medium'>
                Identificador <strong className='text-red-500'>(*)</strong>
              </label>
              <Textinput
                name='identificador'
                type='text'
                placeholder='Ingrese el identificador de la votación...'
                register={register}
                error={errors.identificador}
                disabled={isCierreDelDia}
              />
            </div>

            <div>
              <label htmlFor='contenido' className='form-label textarea block font-medium'>
                Contenido <strong className='text-red-500'>(*)</strong>
              </label>
              <Textarea
                name='contenido'
                rows={4}
                className='w-full border border-gray-300 rounded-lg p-2'
                placeholder='Ingrese la descripción de la votación...'
                register={register}
                disabled={isCierreDelDia}
              />
              {errors.contenido && <p className='text-red-500 text-sm'>{errors.contenido.message}</p>}
            </div>
          </form>
        </Card>

        <div className='flex justify-end gap-4 mt-8'>
          <button
            className='btn-danger py-2 px-6 rounded-lg'
            onClick={() => navigate(`/votaciones?page=${currentPage}`)}
          >
            Volver
          </button>
          <Button
            type='submit'
            text={isSubmitting ? 'Creando...' : 'Crear'}
            className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white py-2 px-6 rounded-lg`}
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </>
      )
}
