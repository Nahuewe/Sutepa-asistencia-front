import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { toast } from 'react-toastify'

const QRScanner = ({ tipo }) => {
  const [status, setStatus] = useState('Esperando escaneo...')
  const [scanResult, setScanResult] = useState(null)
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!scannerRef.current) return

    const config = { fps: 10, qrbox: { width: 250, height: 250 } }
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
    try {
      const data = JSON.parse(decodedText)
      setScanResult(data)

      if (tipo === 'ingreso') {
        toast.success(`Ingreso de ${data.apellido} ${data.nombre}`)
        navigate('/ingreso', { state: { usuarioDesdeQR: data } })
      } else {
        toast.success(`Egreso de ${data.apellido} ${data.nombre}`)
        navigate('/egreso', { state: { usuarioDesdeQR: data } })
      }

      await html5QrCodeRef.current.clear()
    } catch (error) {
      console.error(`Error escaneando ${tipo}:`, error)
      setStatus(`Error escaneando ${tipo}.`)
      await html5QrCodeRef.current.clear()
    }
  }

  const handleScanError = (error) => {
    console.warn(`Error escaneando (${tipo}):`, error)
  }

  return (
    <div className='flex flex-col items-center gap-4 mt-8'>
      <div id='qr-reader' style={{ width: '300px', height: '300px' }} ref={scannerRef} />
      <p className='text-center'>{status}</p>
      {scanResult && (
        <pre className='bg-gray-100 p-2 rounded'>{JSON.stringify(scanResult, null, 2)}</pre>
      )}
    </div>
  )
}

export default QRScanner
