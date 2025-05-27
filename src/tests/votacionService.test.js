/* eslint-disable no-undef */
import { vi, describe, test, afterEach, expect } from 'vitest'
import { sutepaApi } from '@/api'
import { getVotacion, getVotacionById, getCantidadVotos, getUsuariosNoVotaron, createVotacion, createVoto, postDetenerVotacion, verificarVotoUsuario, getVotacionExcel, getVotoExcel } from '@/services/votacionService'

vi.mock('@/api')

describe('Servicios de votaciones', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('getVotacion retorna las votaciones', async () => {
    const mock = { data: [{ id: 1 }] }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getVotacion()
    expect(sutepaApi.get).toHaveBeenCalledWith('/votaciones')
    expect(res).toEqual(mock.data)
  })

  test('getVotacionById retorna una votación específica', async () => {
    const mock = { data: { id: 5 } }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getVotacionById(5)
    expect(sutepaApi.get).toHaveBeenCalledWith('/votaciones/5')
    expect(res).toEqual(mock.data)
  })

  test('getCantidadVotos retorna resultados de una votación', async () => {
    const mock = { data: { afirmativo: 3, negativo: 1 } }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getCantidadVotos(2)
    expect(sutepaApi.get).toHaveBeenCalledWith('/votaciones/2/respuestas')
    expect(res).toEqual(mock.data)
  })

  test('getUsuariosNoVotaron retorna los usuarios que no votaron', async () => {
    const mock = { data: [{ id: 10 }] }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getUsuariosNoVotaron(4)
    expect(sutepaApi.get).toHaveBeenCalledWith('/votaciones/4/no-votaron')
    expect(res).toEqual(mock.data)
  })

  test('createVotacion crea una nueva votación', async () => {
    const form = { nombre: 'Nueva votación' }
    const mock = { data: { success: true } }
    sutepaApi.post.mockResolvedValueOnce(mock)
    const res = await createVotacion(form)
    expect(sutepaApi.post).toHaveBeenCalledWith('/votaciones', form)
    expect(res).toEqual(mock.data)
  })

  test('createVoto envía un voto', async () => {
    const form = { votacion_id: 1, respuesta: 'afirmativo', asistente_id: 3 }
    const mock = { data: { success: true } }
    sutepaApi.post.mockResolvedValueOnce(mock)
    const res = await createVoto(form)
    expect(sutepaApi.post).toHaveBeenCalledWith('/votos', form)
    expect(res).toEqual(mock.data)
  })

  test('postDetenerVotacion detiene una votación', async () => {
    const mock = { data: { success: true } }
    sutepaApi.post.mockResolvedValueOnce(mock)
    const res = await postDetenerVotacion(7)
    expect(sutepaApi.post).toHaveBeenCalledWith('/votaciones/7/detener')
    expect(res).toEqual(mock.data)
  })

  test('verificarVotoUsuario verifica si un usuario ya votó', async () => {
    const body = { votacion_id: 1, asistente_id: 2 }
    const mock = { data: { yaVoto: false } }
    sutepaApi.post.mockResolvedValueOnce(mock)
    const res = await verificarVotoUsuario(body)
    expect(sutepaApi.post).toHaveBeenCalledWith('/votos/verificar', body)
    expect(res).toEqual(mock.data)
  })

  test('getVotacionExcel descarga el Excel de votaciones', async () => {
    const blob = new Blob(['exceldata'])
    const mock = { data: blob }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getVotacionExcel()
    expect(sutepaApi.get).toHaveBeenCalledWith('/votaciones/exportar', {
      responseType: 'blob'
    })
    expect(res).toEqual(blob)
  })

  test('getVotoExcel descarga el Excel de votos', async () => {
    const blob = new Blob(['exceldata'])
    const mock = { data: blob }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getVotoExcel()
    expect(sutepaApi.get).toHaveBeenCalledWith('/votos/exportar', {
      responseType: 'blob'
    })
    expect(res).toEqual(blob)
  })
})

// --- Tests de errores ---

describe('Errores en servicios de votaciones', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('getVotacion lanza error si falla la API', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getVotacion'))
    await expect(getVotacion()).rejects.toThrow('Falló getVotacion')
  })

  test('getVotacionById lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getVotacionById'))
    await expect(getVotacionById(1)).rejects.toThrow('Falló getVotacionById')
  })

  test('getCantidadVotos lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getCantidadVotos'))
    await expect(getCantidadVotos(1)).rejects.toThrow('Falló getCantidadVotos')
  })

  test('getUsuariosNoVotaron lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getUsuariosNoVotaron'))
    await expect(getUsuariosNoVotaron(1)).rejects.toThrow('Falló getUsuariosNoVotaron')
  })

  test('createVotacion lanza error', async () => {
    sutepaApi.post.mockRejectedValueOnce(new Error('Falló createVotacion'))
    await expect(createVotacion({})).rejects.toThrow('Falló createVotacion')
  })

  test('createVoto lanza error', async () => {
    sutepaApi.post.mockRejectedValueOnce(new Error('Falló createVoto'))
    await expect(createVoto({})).rejects.toThrow('Falló createVoto')
  })

  test('postDetenerVotacion lanza error', async () => {
    sutepaApi.post.mockRejectedValueOnce(new Error('Falló postDetenerVotacion'))
    await expect(postDetenerVotacion(1)).rejects.toThrow('Falló postDetenerVotacion')
  })

  test('verificarVotoUsuario lanza error', async () => {
    sutepaApi.post.mockRejectedValueOnce(new Error('Falló verificarVotoUsuario'))
    await expect(verificarVotoUsuario({ votacion_id: 1, asistente_id: 1 }))
      .rejects.toThrow('Falló verificarVotoUsuario')
  })

  test('getVotacionExcel lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getVotacionExcel'))
    await expect(getVotacionExcel()).rejects.toThrow('Falló getVotacionExcel')
  })

  test('getVotoExcel lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getVotoExcel'))
    await expect(getVotoExcel()).rejects.toThrow('Falló getVotoExcel')
  })
})
