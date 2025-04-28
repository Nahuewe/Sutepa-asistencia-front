/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleUser, setErrorMessage } from '@/store/user'
import { handleShowEdit, handleShowModal } from '@/store/layout'
import { sutepaApi } from '../api'

export const useUserStore = () => {
  const { users, paginate, activeUser } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const startLoadingUsers = async (page) => {
    try {
      const response = await sutepaApi.get(`/user?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleUser({ data, meta }))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingUser = async (form) => {
    try {
      const response = await sutepaApi.post('/registrar', form)
      startLoadingUsers()
      dispatch(handleShowModal())

      toast.success('Usuario agregado con exito')
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
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo crear el usuario: ${errorMessage}`)
    }
  }

  const startUpdateUser = async (form) => {
    try {
      const id = activeUser.id
      const response = await sutepaApi.put(`/user/${id}`, form)
      const { data } = response.data
      startLoadingUsers()
      dispatch(handleShowEdit())

      toast.info('Usuario actualizado con exito')
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
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo editar el usuario: ${errorMessage}`)
    }
  }

  const startDeleteUser = async () => {
    try {
      const id = activeUser.id
      await sutepaApi.delete(`/user/${id}`)
      startLoadingUsers()

      const message = activeUser.estado === 'ACTIVO' ? 'Usuario dado de baja con éxito' : 'Usuario reactivado con éxito'
      toast.success(message)
    } catch (error) {
      toast.error('No se pudo realizar la operación')
    }
  }

  return {
    //* Propiedades
    users,
    paginate,
    activeUser,

    //* Metodos
    startLoadingUsers,
    startSavingUser,
    startDeleteUser,
    startUpdateUser
  }
}
