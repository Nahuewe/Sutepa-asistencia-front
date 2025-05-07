import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createOrdenesDiarias, fetchOrdenesDiariasById, updateOrdenesDiarias } from '@/services/ordenesDiariasService'
import { toast } from 'react-toastify'
import { Card } from 'flowbite-react'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'

export const CreateOrdenesDiarias = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage] = useState(initialPage)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
    setValue
  } = useForm()

  const onSubmit = async (items) => {
    items.tipo = 'ORDEN DEL DÍA'

    try {
      if (id) {
        if (!items.password) {
          delete items.password
        }
        await updateOrdenesDiarias(id, items)
        toast.info('Orden diaria editada exitosamente')
        navigate(`/ordenes-diarias?page=${currentPage}`)
      } else {
        await createOrdenesDiarias(items)
        toast.success('Orden diaria creada exitosamente')
        navigate('/ordenes-diarias')
      }
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en la actualización de Afiliado:', errorMessage)
      toast.error(`No se pudo crear la orden diaria: ${errorMessage}`)
    }
  }

  const loadOrdenDiaria = async () => {
    setIsLoading(true)
    if (id) {
      try {
        const response = await fetchOrdenesDiariasById(id)
        const ordenDiaria = response.data
        setValue('tipo', 'ORDEN DEL DÍA')
        setValue('identificador', ordenDiaria.identificador)
        setValue('contenido', ordenDiaria.contenido)
      } catch (error) {
        console.error('Error al cargar el ordenDiaria:', error)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadOrdenDiaria()
  }, [id])

  return (
    <>
      {isLoading
        ? (
          <Loading />
          )
        : (
          <>
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
                <div>
                  <label htmlFor='tipo' className='form-label space-y-2'>
                    Orden Diaria
                    <strong className='obligatorio'>(*)</strong>
                    <Textinput
                      name='tipo'
                      type='text'
                      placeholder='ORDEN DEL DÍA'
                      register={register}
                      readonly
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor='identificador' className='form-label space-y-2'>
                    Identificador
                    <strong className='obligatorio'>(*)</strong>
                    <Textinput
                      name='identificador'
                      type='text'
                      placeholder='Identificador'
                      register={register}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor='contenido' className='form-label space-y-2'>
                    Contenido
                    <strong className='obligatorio'>(*)</strong>
                    <Textinput
                      name='contenido'
                      type='text'
                      placeholder='Contenido'
                      register={register}
                    />
                  </label>
                </div>
              </form>
            </Card>
            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button
                  className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                  onClick={() => navigate(`/ordenes-diarias?page=${currentPage}`)}
                >
                  Volver
                </button>
              </div>
              <div className='ltr:text-right rtl:text-left'>
                <Button
                  type='submit'
                  text={isSubmitting ? 'Guardando' : 'Guardar'}
                  className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </div>
          </>
          )}
    </>
  )
}
