import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetParameters } from '@/helpers'
import { createUser, getUserById, updateUser } from '@/services/userService'
import { toast } from 'react-toastify'
import { Card } from 'flowbite-react'
import Textinput from '@/components/ui/Textinput'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'

export const CreateUser = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialPage = parseInt(queryParams.get('page')) || 1
  const [currentPage] = useState(initialPage)
  const { id } = useParams()
  const { startSelectRoles, startSelectSeccionales } = useGetParameters()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [seccionales, setSeccionales] = useState([])
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
        if (!items.password) {
          delete items.password
        }
        await updateUser(id, items)
        toast.info('Usuario editado exitosamente')
        navigate(`/usuarios?page=${currentPage}`)
      } else {
        await createUser(items)
        toast.success('Usuario creado exitosamente')
        navigate('/usuarios')
      }
    } catch (error) {
      toast.error('Completa todos los campos')
    }
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

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
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor='dni' className='form-label space-y-2'>
                    DNI
                    <Textinput
                      name='dni'
                      type='text'
                      placeholder='DNI'
                      register={register}
                      error={errors.dni}
                    />
                  </label>
                </div>

                <div>
                  <label htmlFor='legajo' className='form-label space-y-2'>
                    Legajo
                    <strong className='obligatorio'>(*)</strong>
                    <Textinput
                      name='legajo'
                      type='text'
                      placeholder='Legajo'
                      register={register}
                      error={errors.legajo}
                    />
                  </label>
                </div>

                <div className='relative'>
                  <label htmlFor='password' className='form-label space-y-2'>
                    Contraseña
                    <strong className='obligatorio'>(*)</strong>
                    <Textinput
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Contraseña'
                      register={register}
                      error={errors.password}
                    />
                    <button
                      type='button'
                      className='absolute top-[45%] right-4 mb-1'
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword
                        ? (
                          <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-eye dark:stroke-white' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                            <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' />
                            <path d='M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6' />
                          </svg>
                          )
                        : (
                          <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-eye-closed dark:stroke-white' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                            <path d='M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4' />
                            <path d='M3 15l2.5 -3.8' />
                            <path d='M21 14.976l-2.492 -3.776' />
                            <path d='M9 17l.5 -4' />
                            <path d='M15 17l-.5 -4' />
                          </svg>
                          )}
                    </button>
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
                      error={errors.seccional_id}
                      placeholder='Seleccione una seccional'
                    />
                  </label>
                </div>
              </form>
            </Card>
            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button
                  className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                  onClick={() => navigate(`/usuarios?page=${currentPage}`)}
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
