import { sutepaApi } from '@/api'

export const getVotacion = async (page = 1) => {
  const response = await sutepaApi.get(`/votaciones?page=${page}`)
  return response.data
}

export const getVotacionById = async (id) => {
  const response = await sutepaApi.get(`/votacion/${id}`)
  return response.data
}

export const createVotacion = async (form) => {
  const response = await sutepaApi.post('/votaciones', form)
  return response.data
}

export const createVoto = async (form) => {
  const response = await sutepaApi.post('/votos', form)
  return response.data
}

export const get = async () => {
  const response = await sutepaApi.get(
    '/votacion/exportar',
    { responseType: 'blob' }
  )
  return response.data
}
