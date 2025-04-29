/* eslint-disable camelcase */
import { sutepaApi } from '@/api'

export const createIngreso = async (form) => {
  const response = await sutepaApi.post('/registrar-ingreso', form)
  return response.data
}

export const createEgreso = async (form) => {
  const response = await sutepaApi.post('/registrar-egreso', form)
  return response.data
}

export const getIngreso = async (page) => {
  const response = await sutepaApi.get(`/ingreso?page=${page}`)
  return response.data
}

export const getEgreso = async (page) => {
  const response = await sutepaApi.get(`/egreso?page=${page}`)
  return response.data
}

export const searchRegistro = async (search, page = 1) => {
  const response = await sutepaApi.get(`/buscar-registro?query=${search}&page=${page}`)
  return response.data
}
