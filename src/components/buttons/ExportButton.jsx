import { useState } from 'react'

const ExportButton = ({
  descargaFn,
  nombreArchivo,
  textoBoton,
  textoExportando,
  colors = {
    normal: 'bg-green-600 hover:bg-green-800',
    exporting: 'bg-red-500 hover:bg-red-600'
  }
}) => {
  const [exportando, setExportando] = useState(false)

  const handleDescargar = async () => {
    setExportando(true)
    try {
      await descargaFn()
    } catch (error) {
      console.error(`Error al exportar ${nombreArchivo}:`, error)
      alert(`No se pudo exportar ${nombreArchivo}`)
    } finally {
      setExportando(false)
    }
  }

  return (
    <button
      onClick={handleDescargar}
      disabled={exportando}
      className={`
        py-2 px-6 rounded-lg text-white disabled:opacity-50 transition-colors duration-300
        ${exportando ? colors.exporting : colors.normal}
      `}
    >
      {exportando ? textoExportando : textoBoton}
    </button>
  )
}

export default ExportButton
