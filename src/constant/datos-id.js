export const tipoBeca = {
  1: 'SÍ',
  2: 'NO'
}

export const tipoSituacion = {
  1: 'TITULAR',
  2: 'SUPLENTE',
  3: 'INTERINO'
}

export const tipoRoles = {
  1: 'ADMINISTRADOR',
  2: 'CARGA'
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

export const getTipoSituacion = (id) => {
  return tipoSituacion[id] || ''
}

export const getTipoBeca = (id) => {
  return tipoBeca[id] || ''
}
