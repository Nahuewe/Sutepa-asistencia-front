import { Card } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import Numberinput from '@/components/ui/Numberinput'
import Select from '@/components/ui/Select'
import Textinput from '@/components/ui/Textinput'
import { useGetParameters } from '@/helpers'
import { createUser, getUserById, updateUser } from '@/services/userService'

export const CreateUser = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage] = useState(initialPage)
  const { id } = useParams()
  const { startSelectRoles, startSelectSeccionales } = useGetParameters()
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [seccionales, setSeccionales] = useState([])
  const [dni, setDni] = useState('')
  const [legajo, setLegajo] = useState('')
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue
  } = useForm()

  const onSubmit = async (items) => {
    try {
      if (id) {
        await updateUser(id, items)
        toast.info('Usuario editado exitosamente')
        navigate(`/asistentes?page=${currentPage}`)
      } else {
        await createUser(items)
        toast.success('Usuario creado exitosamente')
        navigate('/asistentes')
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
      toast.error(`No se pudo crear el usuario: ${errorMessage}`)
    }
  }

  const handleLegajoChange = (e) => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')

    const maxLength = 7
    const legajoLimited = cleanedValue.slice(0, maxLength)

    setLegajo(legajoLimited)
    setValue('legajo', legajoLimited)
  }

  const handleDniChange = (e) => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')
    const dniFormat = /^(\d{1,2})(\d{3})(\d{3})$/
    let formattedDni = ''
    const maxLength = 8

    if (cleanedValue.length > maxLength) {
      return
    }

    if (cleanedValue.length > 1 && cleanedValue.length <= 9) {
      formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
    } else {
      formattedDni = cleanedValue
    }

    setDni(formattedDni)
    setValue('dni', formattedDni)
  }

  const loadUser = async () => {
    setIsLoading(true)
    const rolesData = await startSelectRoles()
    const seccionalesData = await startSelectSeccionales()
    setRoles(rolesData)
    setSeccionales(seccionalesData)
    if (id) {
      try {
        const response = await getUserById(id)
        const usuario = response.data
        setValue('nombre', usuario.nombre)
        setValue('apellido', usuario.apellido)
        setValue('dni', usuario.dni)
        setValue('legajo', usuario.legajo)
        setValue('roles_id', usuario.roles_id)
        setValue('seccional_id', usuario.seccional_id)
      } catch (error) {
        console.error('Error al cargar el usuario:', error)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadUser()
  }, [id])

  if (user.roles_id !== 1) {
    return <p className='text-red-600 font-semibold'>No tenés permisos para crear usuarios.</p>
  }

  const isEditable = user.roles_id === 1

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
                  <label htmlFor='nombre' className='form-label space-y-2'>
                    Nombre
                    <strong className='obligatorio'>(*)</strong>
                    <Textinput
                      name='nombre'
                      type='text'
                      placeholder='Nombre'
                      register={register}
                      error={errors.nombre}
                      disabled={!isEditable}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor='apellido' className='form-label space-y-2'>
                    Apellido
                    <strong className='obligatorio'>(*)</strong>
                    <Textinput
                      name='apellido'
                      type='text'
                      placeholder='Apellido'
                      register={register}
                      error={errors.apellido}
                      disabled={!isEditable}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor='dni' className='form-label space-y-2'>
                    DNI
                    <strong className='obligatorio'>(*)</strong>
                    <Numberinput
                      name='dni'
                      type='text'
                      placeholder='DNI'
                      register={register}
                      error={errors.dni}
                      value={dni}
                      onChange={handleDniChange}
                      disabled={!isEditable}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor='legajo' className='form-label space-y-2'>
                    Legajo
                    <strong className='obligatorio'>(*)</strong>
                    <Numberinput
                      name='legajo'
                      type='text'
                      placeholder='Legajo'
                      register={register}
                      error={errors.legajo}
                      value={legajo}
                      onChange={handleLegajoChange}
                      disabled={!isEditable}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor='roles_id' className='form-label space-y-2'>
                    Roles
                    <strong className='obligatorio'>(*)</strong>
                    <Select
                      name='roles_id'
                      options={roles}
                      register={register}
                      error={errors.roles_id}
                      placeholder='Seleccione un rol'
                      disabled={!isEditable}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor='seccional_id' className='form-label space-y-2'>
                    Seccional
                    <strong className='obligatorio'>(*)</strong>
                    <Select
                      name='seccional_id'
                      options={seccionales}
                      register={register}
                      error={errors.seccional}
                      placeholder='Seleccione una seccional'
                      disabled={!isEditable}
                    />
                  </label>
                </div>
              </form>
            </Card>
            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button
                  className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                  onClick={() => navigate(`/asistentes?page=${currentPage}`)}
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
