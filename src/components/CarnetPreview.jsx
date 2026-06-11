import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

const getInitials = (name) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export default function CarnetPreview({ alumno, baseImage }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const containerRef = useRef(null)

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
  }, [alumno.numero])

  if (!baseImage) return null

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
        top: '58.5%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '38%',
        height: '9%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h2 style={{ 
          margin: 0, 
          fontFamily: "'Poppins', sans-serif", 
          fontSize: '1.25rem', 
          fontWeight: 'bold',
          color: '#1f382a',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textAlign: 'center'
        }}>
          {alumno.nombre}
        </h2>
      </div>

      {/* 3. Bottom Banner: Member Number */}
      <div style={{
        position: 'absolute',
        top: '82%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '28%',
        height: '6%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ 
          margin: 0, 
          fontFamily: "'Poppins', sans-serif", 
          fontSize: 'calc(0.9rem + 2px)', 
          fontWeight: 800, 
          color: '#1f382a',
          letterSpacing: '0.1em'
        }}>
          {alumno.numero}
        </p>
      </div>

      {/* 4. Bottom Square: QR Code */}
      {qrDataUrl && (
        <div style={{
          position: 'absolute',
          top: '33.5%',
          left: '78.7%',
          transform: 'translateX(-50%)',
          width: '15.7%',
          height: '29%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ width: '100%', height: '6px', background: 'rgb(31, 56, 42)', borderRadius: '5px', marginBottom: '2px' }}></div>

          <img src={qrDataUrl} alt={`QR ${alumno.nombre}`} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />

          <div style={{ width: '100%', height: '6px', background: 'rgb(31, 56, 42)', borderRadius: '5px', marginTop: '2px' }}></div>
        </div>
      )}
    </div>
  )
}
