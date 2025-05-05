export const tipoRoles = {
  1: 'ADMINISTRADOR',
  2: 'SECRETARIO',
  3: 'INGRESO',
  4: 'EGRESO',
  5: 'AFILIADO'
}

export const formatDate = (dateString) => {
  if (!dateString) {
    return ''
  }

  const date = new Date(dateString)
  if (isNaN(date)) {
    return ''
  }

  const userTimezoneOffset = date.getTimezoneOffset() * 60000
  const adjustedDate = new Date(date.getTime() + userTimezoneOffset)

  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return adjustedDate.toLocaleDateString(undefined, options)
}

export const formatearFechaArgentina = (fecha) => {
  if (!fecha) return '-'

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(fecha))
}

export const getTipoRoles = (id) => {
  return tipoRoles[id] || ''
}
