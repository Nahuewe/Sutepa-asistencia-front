import { useState, useEffect } from 'react'
import { sutepaApi } from '@/api'

export const useEventosVotaciones = (id) => {
  const [torta, setTorta] = useState([])

  useEffect(() => {
    if (!id) return
    const fetchTorta = async () => {
      try {
        const response = await sutepaApi.get(`/votaciones/${id}/respuestas`)
        const respuestas = response.data

        const conteos = respuestas.reduce((acc, voto) => {
          const key = voto.respuesta.trim()
          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {})

        const dataFormatted = Object.entries(conteos).map(([label, value], index) => ({
          id: index,
          label,
          value
        }))

        setTorta(dataFormatted)
      } catch (error) {
        console.error('Error obteniendo respuestas de votación:', error)
      }
    }

    fetchTorta()
  }, [id])

  return torta
}
