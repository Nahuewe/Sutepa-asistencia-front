export const tipoRoles = {
  1: 'ADMINISTRADOR',
  2: 'INGRESO',
  3: 'EGRESO',
  4: 'AFILIADO'
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

export const getTipoRoles = (id) => {
  return tipoRoles[id] || ''
}
