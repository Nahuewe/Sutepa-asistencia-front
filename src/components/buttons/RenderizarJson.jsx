export const renderizarJson = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString)

    const filtrarClaves = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        const copia = { ...obj }
        delete copia.created_at
        delete copia.updated_at
        delete copia.deleted_at
        return copia
      }
      return obj
    }

    if (Array.isArray(parsed)) {
      return parsed.length
        ? (
          <ul className='list-disc list-inside'>
            {parsed.map((item, idx) => (
              <li key={idx}>{JSON.stringify(filtrarClaves(item))}</li>
            ))}
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
              <strong>{key}:</strong> {String(value)}
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
