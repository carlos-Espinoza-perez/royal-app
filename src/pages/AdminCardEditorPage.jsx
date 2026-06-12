import { useState, useEffect } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import CarnetPreview from '../components/CarnetPreview.jsx'
import { useToast } from '../contexts/ToastContext.jsx'

const DEFAULT_CONFIG = {
  name: { top: 63.3, left: 50, width: 42, fontSize: 1.3 },
  number: { top: 84.9, left: 50, width: 30, fontSize: 1.1 },
  qr: { top: 48, left: 78.9, width: 16.2 }
}

export default function AdminCardEditorPage() {
  const { showToast } = useToast()
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  
  // Fake student data for preview
  const previewAlumno = {
    id: 999,
    nombre: 'YOHANNA ESPINOZA',
    numero: 'RT-2026-001',
    activo: true
  }

  useEffect(() => {
    const saved = localStorage.getItem('royal_carnet_config')
    if (saved) {
      try { setConfig(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  const handleChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: Number(value)
      }
    }))
  }

  const handleSave = () => {
    localStorage.setItem('royal_carnet_config', JSON.stringify(config))
    showToast('Configuración guardada localmente')
  }

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG)
    localStorage.removeItem('royal_carnet_config')
    showToast('Configuración restaurada por defecto')
  }

  const renderSliders = (section, label, hasFontSize = true) => (
    <div style={{ marginBottom: '1.5rem', background: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text)' }}>{label}</h3>
      
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Posición Vertical (Top %): {config[section].top}</span>
          <input type="range" min="0" max="100" step="0.1" 
            value={config[section].top} onChange={(e) => handleChange(section, 'top', e.target.value)} />
        </label>
        
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Posición Horizontal (Left %): {config[section].left}</span>
          <input type="range" min="0" max="100" step="0.1" 
            value={config[section].left} onChange={(e) => handleChange(section, 'left', e.target.value)} />
        </label>
        
        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Ancho (Width %): {config[section].width}</span>
          <input type="range" min="0" max="100" step="0.1" 
            value={config[section].width} onChange={(e) => handleChange(section, 'width', e.target.value)} />
        </label>

        {hasFontSize && (
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Tamaño Letra (rem): {config[section].fontSize}</span>
            <input type="range" min="0.5" max="3" step="0.05" 
              value={config[section].fontSize} onChange={(e) => handleChange(section, 'fontSize', e.target.value)} />
          </label>
        )}
      </div>
    </div>
  )

  return (
    <AdminShell title="Editor de Plantilla" eyebrow="Diseño" backTo="/admin/carnets">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
        
        <RoyalFrame className="editor-preview">
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Vista Previa en Tiempo Real</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Los cambios se reflejan inmediatamente en esta tarjeta.</p>
          </div>
          
          <div style={{ 
            width: '100%', 
            overflow: 'auto', 
            background: 'var(--background)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{ 
              transform: 'scale(0.7)', 
              transformOrigin: 'top center',
              width: '850px',
              height: '385px' /* 550 * 0.7 */
            }}>
              <CarnetPreview 
                alumno={previewAlumno} 
                baseImage="/carnet-bg.jpg" 
                configOverride={config} 
              />
            </div>
          </div>
        </RoyalFrame>

        <RoyalFrame className="editor-controls">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Controles</h2>
            <button onClick={handleReset} className="icon-button" style={{ color: 'var(--muted)' }} aria-label="Restaurar por defecto" title="Restaurar por defecto">
              <RotateCcw size={18} />
            </button>
          </div>

          <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {renderSliders('name', 'Nombre del Miembro', true)}
            {renderSliders('number', 'Número de Miembro', true)}
            {renderSliders('qr', 'Código QR', false)}
          </div>

          <button 
            className="royal-button royal-button--gold" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}
            onClick={handleSave}
          >
            <Save size={18} />
            Guardar Configuración
          </button>
        </RoyalFrame>

      </div>
    </AdminShell>
  )
}
