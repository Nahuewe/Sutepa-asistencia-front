import { sutepaApi } from '@/api'

export const getUsuario = async (page = 1) => {
  const response = await sutepaApi.get(`/user?page=${page}`)
  return response.data
}

export const getUsuarioById = async (id) => {
  const response = await sutepaApi.get(`/user/${id}`)
  return response.data
}

export const createUsuario = async (form) => {
  const response = await sutepaApi.post('/registrar', form)
  return response.data
}

export const updateUsuario = async (id, form) => {
  const response = await sutepaApi.put(`/user/${id}`, form)
  return response.data
}

export const deleteUsuario = async (id) => {
  const response = await sutepaApi.delete(`/user/${id}`)
  return response.data
}

export const searchUsuario = async (search, page = 1) => {
  const response = await sutepaApi.get(`/buscar-user?query=${search}&page=${page}`)
  return response.data
}
