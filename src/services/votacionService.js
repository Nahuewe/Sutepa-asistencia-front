/* eslint-disable camelcase */
import { sutepaApi } from '@/api'

export const getVotacion = async (page = 1) => {
  const response = await sutepaApi.get(`/votaciones?page=${page}`)
  return response.data
}

export const getVotacionById = async (id) => {
  const response = await sutepaApi.get(`/votaciones/${id}`)
  return response.data
}

export const getConteoVotacion = async (id) => {
  const response = await sutepaApi.get(`/votaciones/${id}/conteo`)
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

export const verificarVotoUsuario = async ({ votacion_id, asistente_id }) => {
  const response = await sutepaApi.post('/votos/verificar', {
    votacion_id,
    asistente_id
  })
  return response.data
}

export const getVotacionExcel = async () => {
  const response = await sutepaApi.get('/votaciones/exportar', {
    responseType: 'blob'
  })
  return response.data
}

export const getVotoExcel = async () => {
  const response = await sutepaApi.get('/votos/exportar', {
    responseType: 'blob'
  })
  return response.data
}
