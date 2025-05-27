/* eslint-disable no-undef */
import { vi, describe, test, afterEach, expect } from 'vitest'
import { sutepaApi } from '@/api'
import { createOrdenesDiarias, deleteOrdenesDiarias, getOrdenesDiarias, getOrdenesDiariasById, updateOrdenesDiarias } from '@/services/ordenesDiariasService'

vi.mock('@/api')

describe('Servicios de órdenes diarias', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('getOrdenesDiarias obtiene órdenes diarias paginadas', async () => {
    const page = 2
    const mock = { data: [{ id: 10 }, { id: 11 }] }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getOrdenesDiarias(page)
    expect(sutepaApi.get).toHaveBeenCalledWith(`/ordenes-diarias?page=${page}`)
    expect(res).toEqual(mock.data)
  })

  test('getOrdenesDiariasById obtiene orden diaria por ID', async () => {
    const id = 5
    const mock = { data: { id } }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getOrdenesDiariasById(id)
    expect(sutepaApi.get).toHaveBeenCalledWith(`/ordenes-diarias/${id}`)
    expect(res).toEqual(mock.data)
  })

  test('createOrdenesDiarias crea una nueva orden diaria', async () => {
    const form = { dato: 'nuevo' }
    const mock = { data: { success: true } }
    sutepaApi.post.mockResolvedValueOnce(mock)
    const res = await createOrdenesDiarias(form)
    expect(sutepaApi.post).toHaveBeenCalledWith('/ordenes-diarias', form)
    expect(res).toEqual(mock.data)
  })

  test('updateOrdenesDiarias actualiza una orden diaria', async () => {
    const id = 7
    const form = { dato: 'actualizado' }
    const mock = { data: { success: true } }
    sutepaApi.put.mockResolvedValueOnce(mock)
    const res = await updateOrdenesDiarias(id, form)
    expect(sutepaApi.put).toHaveBeenCalledWith(`/ordenes-diarias/${id}`, form)
    expect(res).toEqual(mock.data)
  })

  test('deleteOrdenesDiarias elimina una orden diaria', async () => {
    const id = 9
    const mock = { data: { success: true } }
    sutepaApi.delete.mockResolvedValueOnce(mock)
    const res = await deleteOrdenesDiarias(id)
    expect(sutepaApi.delete).toHaveBeenCalledWith(`/ordenes-diarias/${id}`)
    expect(res).toEqual(mock.data)
  })
})

// --- Tests de errores ---

describe('Errores en servicios de órdenes diarias', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('getOrdenesDiarias lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getOrdenesDiarias'))
    await expect(getOrdenesDiarias(1)).rejects.toThrow('Falló getOrdenesDiarias')
  })

  test('getOrdenesDiariasById lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getOrdenesDiariasById'))
    await expect(getOrdenesDiariasById(1)).rejects.toThrow('Falló getOrdenesDiariasById')
  })

  test('createOrdenesDiarias lanza error', async () => {
    sutepaApi.post.mockRejectedValueOnce(new Error('Falló createOrdenesDiarias'))
    await expect(createOrdenesDiarias({})).rejects.toThrow('Falló createOrdenesDiarias')
  })

  test('updateOrdenesDiarias lanza error', async () => {
    sutepaApi.put.mockRejectedValueOnce(new Error('Falló updateOrdenesDiarias'))
    await expect(updateOrdenesDiarias(1, {})).rejects.toThrow('Falló updateOrdenesDiarias')
  })

  test('deleteOrdenesDiarias lanza error', async () => {
    sutepaApi.delete.mockRejectedValueOnce(new Error('Falló deleteOrdenesDiarias'))
    await expect(deleteOrdenesDiarias(1)).rejects.toThrow('Falló deleteOrdenesDiarias')
  })
})
