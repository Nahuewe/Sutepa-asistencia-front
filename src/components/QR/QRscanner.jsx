import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createEgreso, createIngreso } from '@/services/registroService'

const QRScanner = ({ tipo }) => {
  const [status, setStatus] = useState('Esperando escaneo...')
  const [, setHasScanned] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const html5QrCodeRef = useRef(null)
  const hasScannedRef = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    const qrRegionId = 'qr-reader'
    const qrCode = new Html5Qrcode(qrRegionId)
    html5QrCodeRef.current = qrCode

    const config = {
      fps: 10,
      qrbox: { width: 350, height: 300 }
    }

    qrCode.start(
      { facingMode: 'environment' },
      config,
      handleScanSuccess,
      handleScanError
    ).then(() => {
      setIsScanning(true)
    }).catch(err => {
      console.error('Error iniciando escáner QR', err)
      setStatus('No se pudo acceder a la cámara')
    })

    return () => {
      if (isScanning && html5QrCodeRef.current) {
        html5QrCodeRef.current.stop()
          .then(() => html5QrCodeRef.current.clear())
          .then(() => setIsScanning(false))
          .catch(err => {
            console.warn('Escáner ya estaba detenido:', err.message)
          })
      }
    }
  }, [])

  const handleScanSuccess = async (decodedText) => {
    if (hasScannedRef.current || !decodedText) return
    hasScannedRef.current = true
    setHasScanned(true)
    setStatus('Procesando...')

    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop()
        await html5QrCodeRef.current.clear()
        setIsScanning(false)
      } catch (err) {
        console.error('Error deteniendo escáner después del escaneo', err)
      }
    }

    let data
    try {
      data = JSON.parse(decodedText)
    } catch {
      setStatus('QR inválido')
      return
    }

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
        toast.success(`${tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} de ${data.apellido} ${data.nombre} registrado`)
        navigate(`/${tipo}`)
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Error desconocido'
        toast.error(msg)
        setStatus(msg)
        navigate(`/${tipo}`, { replace: true })
      })
  }

  const handleScanError = (error) => {
    console.warn(`Error escaneando (${tipo}):`, error)
  }

  const handleCancel = () => {
    navigate(`/${tipo}`, { replace: true })
  }

  return (
    <div className='flex flex-col items-center p-4 max-w-sm mx-auto'>
      <div className='bg-white dark:bg-gray-100 rounded-lg shadow-lg p-4 w-full'>
        <h2 className='text-xl font-bold text-center mb-4 dark:text-gray-700'>
          {tipo === 'ingreso' ? 'Registro de Ingreso' : 'Registro de Egreso'}
        </h2>

        <div className='relative w-full mb-4 rounded-lg overflow-hidden border-2 border-blue-500'>
          <div
            id='qr-reader'
            className='absolute inset-0'
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <div className='flex flex-col items-center'>
          <div className={`text-sm font-medium px-4 py-2 rounded-full mb-4 ${
            status.includes('Procesando')
              ? 'bg-yellow-100 text-yellow-800'
              : status.includes('inválido') || status.includes('No se detectó')
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
          }`}
          >
            <div className='flex items-center'>
              {status.includes('Procesando') && (
                <div className='mr-2 w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin' />
              )}
              {status}
            </div>
          </div>

          <button
            onClick={handleCancel}
            className='px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors'
          >
            Cancelar
          </button>
        </div>
      </div>

      <div className='mt-4 text-center text-sm text-gray-500'>
        <p>Apunte la cámara o suba una imagen del QR para {tipo === 'ingreso' ? 'registrar ingreso' : 'registrar egreso'}</p>
      </div>
    </div>
  )
}

export default QRScanner
