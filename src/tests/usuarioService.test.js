/* eslint-disable no-undef */
import { vi, describe, test, afterEach, expect } from 'vitest'
import { sutepaApi } from '@/api'
import { createUsuario, deleteUsuario, getUsuario, getUsuarioById, searchUsuario, updateUsuario } from '@/services/usuarioService'

vi.mock('@/api')

describe('Servicios de usuarios', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('getUsuario obtiene usuarios paginados', async () => {
    const mock = { data: [{ id: 1 }] }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getUsuario(2)
    expect(sutepaApi.get).toHaveBeenCalledWith('/user?page=2')
    expect(res).toEqual(mock.data)
  })

  test('getUsuarioById obtiene un usuario por ID', async () => {
    const mock = { data: { id: 5 } }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await getUsuarioById(5)
    expect(sutepaApi.get).toHaveBeenCalledWith('/user/5')
    expect(res).toEqual(mock.data)
  })

  test('createUsuario crea un nuevo usuario', async () => {
    const form = { nombre: 'Nahuel' }
    const mock = { data: { success: true } }
    sutepaApi.post.mockResolvedValueOnce(mock)
    const res = await createUsuario(form)
    expect(sutepaApi.post).toHaveBeenCalledWith('/registrar', form)
    expect(res).toEqual(mock.data)
  })

  test('updateUsuario actualiza un usuario', async () => {
    const form = { nombre: 'Actualizado' }
    const mock = { data: { success: true } }
    sutepaApi.put.mockResolvedValueOnce(mock)
    const res = await updateUsuario(3, form)
    expect(sutepaApi.put).toHaveBeenCalledWith('/user/3', form)
    expect(res).toEqual(mock.data)
  })

  test('deleteUsuario elimina un usuario', async () => {
    const mock = { data: { success: true } }
    sutepaApi.delete.mockResolvedValueOnce(mock)
    const res = await deleteUsuario(8)
    expect(sutepaApi.delete).toHaveBeenCalledWith('/user/8')
    expect(res).toEqual(mock.data)
  })

  test('searchUsuario busca usuarios', async () => {
    const mock = { data: [{ nombre: 'Juan' }] }
    sutepaApi.get.mockResolvedValueOnce(mock)
    const res = await searchUsuario('juan', 1)
    expect(sutepaApi.get).toHaveBeenCalledWith('/buscar-user?query=juan&page=1')
    expect(res).toEqual(mock.data)
  })
})

// --- Tests de errores ---

describe('Errores en servicios de usuarios', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('getUsuario lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getUsuario'))
    await expect(getUsuario()).rejects.toThrow('Falló getUsuario')
  })

  test('getUsuarioById lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló getUsuarioById'))
    await expect(getUsuarioById(1)).rejects.toThrow('Falló getUsuarioById')
  })

  test('createUsuario lanza error', async () => {
    sutepaApi.post.mockRejectedValueOnce(new Error('Falló createUsuario'))
    await expect(createUsuario({})).rejects.toThrow('Falló createUsuario')
  })

  test('updateUsuario lanza error', async () => {
    sutepaApi.put.mockRejectedValueOnce(new Error('Falló updateUsuario'))
    await expect(updateUsuario(1, {})).rejects.toThrow('Falló updateUsuario')
  })

  test('deleteUsuario lanza error', async () => {
    sutepaApi.delete.mockRejectedValueOnce(new Error('Falló deleteUsuario'))
    await expect(deleteUsuario(1)).rejects.toThrow('Falló deleteUsuario')
  })

  test('searchUsuario lanza error', async () => {
    sutepaApi.get.mockRejectedValueOnce(new Error('Falló searchUsuario'))
    await expect(searchUsuario('nahuel')).rejects.toThrow('Falló searchUsuario')
  })
})
