import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

const getInitials = (name) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export default function CarnetPreview({ alumno, baseImage, configOverride }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [localConfig, setLocalConfig] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Load config from localStorage if no override is provided
    const saved = localStorage.getItem('royal_carnet_config')
    if (saved) {
      try { setLocalConfig(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  useEffect(() => {
    // Generate QR pointing to the student's personal dashboard URL
    // window.location.origin captures the current domain automatically
    const dashboardUrl = `${window.location.origin}/alumno/${alumno.id}`
    QRCode.toDataURL(dashboardUrl, {
      width: 256,
      margin: 0,
      color: {
        dark: '#1f382a', // Vintage dark olive green matching the bill ink
        light: '#ffffff00', // Transparent background to blend nicely
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err))
  }, [alumno.numero, alumno.id])

  if (!baseImage) return null

  const config = configOverride || localConfig || {
    name: { top: 63.3, left: 50, width: 42, fontSize: 1.3 },
    number: { top: 84.9, left: 50, width: 30, fontSize: 1.1 },
    qr: { top: 48, left: 78.9, width: 16.2 }
  };

  // Proporción estándar de Tarjeta CR80 (8.5cm x 5.5cm)
  return (
    <div 
      ref={containerRef}
      className="carnet-export-container"
      style={{
        position: 'relative',
        width: '850px',
        height: '550px',
        backgroundImage: `url(${baseImage})`,
        backgroundSize: '100% 100%', // Stretch exactly to fit in case of slight ratio diffs
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 2. Top Banner: Member Name */}
      <div style={{
        position: 'absolute',
        top: `${config.name.top}%`,
        left: `${config.name.left}%`,
        transform: 'translate(-50%, -50%)',
        width: `${config.name.width}%`,
        height: '8%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h2 style={{ 
          margin: 0, 
          fontFamily: "'Cinzel', serif", 
          fontSize: `${config.name.fontSize}rem`, 
          fontWeight: 'bold',
          color: '#1f382a',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}>
          {alumno.nombre}
        </h2>
      </div>

      {/* 3. Bottom Banner: Member Number */}
      <div style={{
        position: 'absolute',
        top: `${config.number.top}%`,
        left: `${config.number.left}%`,
        transform: 'translate(-50%, -50%)',
        width: `${config.number.width}%`,
        height: '6%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ 
          margin: 0, 
          fontFamily: "'Cinzel', serif", 
          fontSize: `${config.number.fontSize}rem`, 
          fontWeight: 800, 
          color: '#1f382a'
        }}>
          {alumno.numero}
        </p>
      </div>

      {/* 4. Right Square: QR Code */}
      {qrDataUrl && (
        <div style={{
          position: 'absolute',
          top: `${config.qr.top}%`,
          left: `${config.qr.left}%`,
          transform: 'translate(-50%, -50%)',
          width: `${config.qr.width}%`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}>
          <div style={{ width: '100%', height: '5px', background: '#1f382a', borderRadius: '5px' }}></div>
          <img src={qrDataUrl} alt={`QR ${alumno.nombre}`} style={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'contain' }} />
          <div style={{ width: '100%', height: '5px', background: '#1f382a', borderRadius: '5px' }}></div>
        </div>
      )}
    </div>
  )
}
