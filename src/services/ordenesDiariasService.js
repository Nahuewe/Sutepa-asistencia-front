import { sutepaApi } from '@/api'

export const getOrdenesDiarias = async (page = 1) => {
  const response = await sutepaApi.get(`/ordenes-diarias?page=${page}`)
  return response.data
}

export const getOrdenesDiariasById = async (id) => {
  const response = await sutepaApi.get(`/ordenes-diarias/${id}`)
  return response.data
}

export const createOrdenesDiarias = async (form) => {
  const response = await sutepaApi.post('/ordenes-diarias', form)
  return response.data
}

export const updateOrdenesDiarias = async (id, form) => {
  const response = await sutepaApi.put(`/ordenes-diarias/${id}`, form)
  return response.data
}

export const deleteOrdenesDiarias = async (id) => {
  const response = await sutepaApi.delete(`/ordenes-diarias/${id}`)
  return response.data
}
