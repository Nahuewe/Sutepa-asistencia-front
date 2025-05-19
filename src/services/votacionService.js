import { sutepaApi } from '@/api'

export const getVotacion = async () => {
  const response = await sutepaApi.get('/votaciones')
  return response.data
}

export const getVotacionById = async (id) => {
  const response = await sutepaApi.get(`/votaciones/${id}`)
  return response.data
}

export const getCantidadVotos = async (id) => {
  const response = await sutepaApi.get(`/votaciones/${id}/respuestas`)
  return response.data
}

export const getCantidadVotosMultiples = async (ids) => {
  const response = await sutepaApi.post('/votos/respuestas-multiples', { ids })
  return response.data
}

export const getUsuariosNoVotaron = async (votacionId) => {
  const response = await sutepaApi.get(`/votaciones/${votacionId}/no-votaron`)
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

export const postDetenerVotacion = async (id) => {
  const response = await sutepaApi.post(`/votaciones/${id}/detener`)
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
