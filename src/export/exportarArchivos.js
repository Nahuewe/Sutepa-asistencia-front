import { getVotacionExcel, getVotoExcel } from '@/services/votacionService'
import { getIngresoExcel, getEgresoExcel } from '@/services/registroService'

export const descargarVotacionesExcel = async () => {
  try {
    const blob = await getVotacionExcel()
    const url = window.URL.createObjectURL(new Blob([blob]))

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'votaciones.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Error al exportar votaciones:', error)
    alert('No se pudo exportar las votaciones')
  }
}

export const descargarVotosExcel = async () => {
  try {
    const blob = await getVotoExcel()
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'votos.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Error al exportar votos:', error)
    alert('No se pudo exportar los votos')
  }
}

export const descargarIngresoExcel = async () => {
  try {
    const blob = await getIngresoExcel()
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'ingresos.xlsx')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error descargando Excel:', error)
  }
}

export const descargarEgresoExcel = async () => {
  try {
    const blob = await getEgresoExcel()
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'egresos.xlsx')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error descargando Excel:', error)
  }
}
