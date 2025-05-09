import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createEgreso, createIngreso } from '@/services/registroService'

const QRScanner = ({ tipo }) => {
  const [status, setStatus] = useState('Esperando escaneo...')
  const [, setScanning] = useState(true)
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!scannerRef.current) return

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    }

    const html5QrCode = new Html5QrcodeScanner('qr-reader', config, false)
    html5QrCode.render(handleScanSuccess, handleScanError)
    html5QrCodeRef.current = html5QrCode

    return () => {
      html5QrCode.clear().catch(error => {
        console.error('Error limpiando el escáner QR', error)
      })
    }
  }, [])

  const handleScanSuccess = async (decodedText) => {
    if (!decodedText) return

    setScanning(false)

    let data
    try {
      data = JSON.parse(decodedText)
    } catch {
      setStatus('QR inválido')
      setScanning(true)
      return
    }

    setStatus('Procesando...')

    const action = tipo === 'ingreso' ? createIngreso : createEgreso

    action({
      dni: data.dni,
      legajo: data.legajo,
      nombre: data.nombre,
      apellido: data.apellido,
      seccional: data.seccional,
      seccional_id: data.seccional_id
    })
      .then(() => {
        toast.success(
        `${tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} de ${data.apellido} ${data.nombre} registrado`
        )
        navigate(`/${tipo}`)
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Error desconocido'
        toast.error(msg)
        setStatus(msg)
        navigate(`/${tipo}`, { replace: true })
      })
      .finally(() => {
        html5QrCodeRef.current.clear().catch(() => {})
      })
  }

  const handleScanError = (error) => {
    console.warn(`Error escaneando (${tipo}):`, error)
  }

  const handleCancel = () => {
    navigate(`/${tipo}`, { replace: true })
  }

  return (
    <div className='flex flex-col items-center p-6 max-w-md mx-auto'>
      <div className='bg-white dark:bg-gray-100 rounded-lg shadow-lg p-6 w-full'>
        <h2 className='text-xl font-bold text-center mb-4 dark:text-black'>
          {tipo === 'ingreso' ? 'Registro de Ingreso' : 'Registro de Egreso'}
        </h2>

        <div className='mb-4'>
          <div
            id='qr-reader'
            className='mx-auto rounded-lg overflow-hidden border-2 border-blue-500 text-black'
            style={{ width: '300px', height: '300px' }}
            ref={scannerRef}
          />
        </div>

        <div className='flex flex-col items-center'>
          <div className={`text-sm font-medium px-4 py-2 rounded-full mb-4 ${
            status === 'Procesando...'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'QR inválido'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
          }`}
          >
            <div className='flex items-center'>
              {status === 'Procesando...' && (
                <div className='mr-2 w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin' />
              )}
              {status}
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              onClick={handleCancel}
              className='px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors'
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <div className='mt-6 text-center text-sm text-gray-500'>
        <p>Apunte la cámara al código QR para {tipo === 'ingreso' ? 'registrar ingreso' : 'registrar egreso'}</p>
      </div>
    </div>
  )
}

export default QRScanner
