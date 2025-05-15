/* eslint-disable no-undef */
import { vi, describe, test, afterEach, expect } from 'vitest'
import { sutepaApi } from '@/api'
import { createIngreso, createEgreso, getIngreso, getEgreso, getIngresoExcel, getEgresoExcel, searchRegistro } from '@/services/registroService'

vi.mock('@/api')

describe('Servicios de registros', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('createIngreso crea un nuevo ingreso', async () => {
    const form = { dato: 'testIngreso' }
    const mock = { data: { success: true } }
    sutepaApi.post.mockResolvedValueOnce(mock)
    const res = await createIngreso(form)
    expect(sutepaApi.post).toHaveBeenCalledWith('/registrar-ingreso', form)
    expect(res).toEqual(mock.data)
  })

  test('createEgreso crea un nuevo egreso', async () => {
    const form = { dato: 'testEgreso' }
    const mock = { data: { success: true } }
    sutepaApi.post.mockResolvedValueOnce(mock)
    const res = await createEgreso(form)
    expect(sutepaApi.post).toHaveBeenCalledWith('/registrar-egreso', form)
    expect(res).toEqual(mock.data)
  })

  test('getIngreso obtiene ingresos paginados', async () => {
    const page = 3
    const mock = { data: [{ id: 1 }, { id: 2 }] }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getIngreso(page)
    expect(sutepaApi.get).toHaveBeenCalledWith(`/ingreso?page=${page}`)
    expect(res).toEqual(mock.data)
  })

  test('getEgreso obtiene egresos paginados', async () => {
    const page = 4
    const mock = { data: [{ id: 5 }] }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getEgreso(page)
    expect(sutepaApi.get).toHaveBeenCalledWith(`/egreso?page=${page}`)
    expect(res).toEqual(mock.data)
  })

  test('getIngresoExcel obtiene archivo excel de ingresos', async () => {
    const mockBlob = new Blob(['dummy'], { type: 'application/octet-stream' })
    const mock = { data: mockBlob }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getIngresoExcel()
    expect(sutepaApi.get).toHaveBeenCalledWith('/ingreso/exportar', { responseType: 'blob' })
    expect(res).toEqual(mockBlob)
  })

  test('getEgresoExcel obtiene archivo excel de egresos', async () => {
    const mockBlob = new Blob(['dummy'], { type: 'application/octet-stream' })
    const mock = { data: mockBlob }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getEgresoExcel()
    expect(sutepaApi.get).toHaveBeenCalledWith('/egreso/exportar', { responseType: 'blob' })
    expect(res).toEqual(mockBlob)
  })

  test('searchRegistro busca registros por query', async () => {
    const search = 'abc'
    const page = 1
    const mock = { data: [{ id: 9 }] }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await searchRegistro(search, page)
    expect(sutepaApi.get).toHaveBeenCalledWith(`/buscar-registro?query=${search}&page=${page}`)
    expect(res).toEqual(mock.data)
  })
})

// --- Tests de errores ---

describe('Errores en servicios de registros', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('createIngreso lanza error', async () => {
    sutepaApi.post.mockRejectedValueOnce(new Error('Falló createIngreso'))
    await expect(createIngreso({})).rejects.toThrow('Falló createIngreso')
  })

  test('createEgreso lanza error', async () => {
    sutepaApi.post.mockRejectedValueOnce(new Error('Falló createEgreso'))
    await expect(createEgreso({})).rejects.toThrow('Falló createEgreso')
  })

  test('getIngreso lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getIngreso'))
    await expect(getIngreso(1)).rejects.toThrow('Falló getIngreso')
  })

  test('getEgreso lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getEgreso'))
    await expect(getEgreso(1)).rejects.toThrow('Falló getEgreso')
  })

  test('getIngresoExcel lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getIngresoExcel'))
    await expect(getIngresoExcel()).rejects.toThrow('Falló getIngresoExcel')
  })

  test('getEgresoExcel lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getEgresoExcel'))
    await expect(getEgresoExcel()).rejects.toThrow('Falló getEgresoExcel')
  })

  test('searchRegistro lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló searchRegistro'))
    await expect(searchRegistro('query')).rejects.toThrow('Falló searchRegistro')
  })
})
