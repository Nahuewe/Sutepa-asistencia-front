import { sutepaApi } from '@/api'

export const fetchUser = async (page = 1) => {
  const response = await sutepaApi.get(`/user?page=${page}`)
  return response.data
}

export const fetchUserById = async (id) => {
  const response = await sutepaApi.get(`/user/${id}`)
  return response.data
}

export const createUser = async (form) => {
  const response = await sutepaApi.post('/registrar', form)
  return response.data
}

export const updateUser = async (id, form) => {
  const response = await sutepaApi.put(`/user/${id}`, form)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await sutepaApi.delete(`/user/${id}`)
  return response.data
}

export const searchUser = async (search, page = 1) => {
  const response = await sutepaApi.get(`/buscar-user?query=${search}&page=${page}`)
  return response.data
}

export const getUser = fetchUser
export const getUserById = fetchUserById
export const createUsuario = createUser
export const updateUsuario = updateUser
export const deleteUsuario = deleteUser
export const searchUsuario = searchUser
