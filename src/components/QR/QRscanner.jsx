import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { createUsuario, searchUsuario } from '@/services/userService'

const QRScanner = () => {
  const [status, setStatus] = useState('Esperando escaneo...')
  const [scanResult, setScanResult] = useState(null)
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } }
    html5QrCodeRef.current = new Html5Qrcode('reader')

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices[0].id
          html5QrCodeRef.current.start(
            cameraId,
            config,
            handleScanSuccess,
            handleScanFailure
          )
        }
      })
      .catch((err) => {
        console.error('Error obteniendo cámara', err)
        setStatus('No se pudo acceder a la cámara.')
      })

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch((err) => console.error('Error al parar QR', err))
      }
    }
  }, [])

  const handleScanSuccess = async (decodedText) => {
    if (!decodedText) return

    try {
      const data = JSON.parse(decodedText)
      setScanResult(data)

      // Buscar si ya existe
      const response = await searchUsuario(data.dni)

      if (response.data.length > 0) {
        setStatus('Usuario ya registrado.')
        await html5QrCodeRef.current.stop()
        return
      }

      // Crear el usuario si no existe
      await createUsuario({
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        legajo: data.legajo,
        roles_id: data.roles_id,
        seccional_id: data.seccional_id
      })

      setStatus('Usuario registrado exitosamente.')
      await html5QrCodeRef.current.stop()
    } catch (error) {
      console.error('Error procesando QR', error)
      setStatus('Error procesando QR.')
      await html5QrCodeRef.current.stop()
    }
  }

  const handleScanFailure = (error) => {
    console.warn(`Error de escaneo: ${error}`)
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <div id='reader' style={{ width: '300px', height: '300px' }} ref={scannerRef} />
      <p className='text-center'>{status}</p>
      {scanResult && (
        <pre className='bg-gray-100 p-2 rounded'>{JSON.stringify(scanResult, null, 2)}</pre>
      )}
    </div>
  )
}

export default QRScanner
