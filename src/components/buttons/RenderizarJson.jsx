import { formatearFechaArgentina } from '@/constant/datos-id'

export const renderizarJson = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString)

    const filtrarClaves = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        const copia = { ...obj }
        delete copia.id
        delete copia.created_at
        delete copia.updated_at
        delete copia.deleted_at
        delete copia.seccional_id
        delete copia.roles_id
        return copia
      }
      return obj
    }

    const formatearValor = (key, value) => {
      if (key === 'activa_hasta' && value) {
        return formatearFechaArgentina(value)
      }
      return value
    }

    if (Array.isArray(parsed)) {
      return parsed.length
        ? (
          <ul className='list-disc list-inside'>
            {parsed.map((item, idx) => {
              const itemFiltrado = filtrarClaves(item)
              return (
                <li key={idx}>
                  {Object.entries(itemFiltrado).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {String(formatearValor(key, value))}
                    </div>
                  ))}
                </li>
              )
            })}
          </ul>
          )
        : (
          <span className='italic text-gray-500'>Sin datos</span>
          )
    }

    const objetoFiltrado = filtrarClaves(parsed)

    return Object.entries(objetoFiltrado).length
      ? (
        <ul className='list-disc list-inside'>
          {Object.entries(objetoFiltrado).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {String(formatearValor(key, value))}
            </li>
          ))}
        </ul>
        )
      : (
        <span className='italic text-gray-500'>Sin datos</span>
        )
  } catch (e) {
    return <span className='italic text-red-500'>Error de formato</span>
  }
}
