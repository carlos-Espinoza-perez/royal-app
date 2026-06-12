import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import AdminShell from '../layouts/AdminShell.jsx';
import AcreditarForm from '../components/AcreditarForm.jsx';
import Modal from '../components/Modal.jsx';
import { useSupabaseData } from '../contexts/SupabaseDataContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { AlertTriangle } from 'lucide-react';

export default function AdminScannerPage() {
  const { alumnos, transacciones, addTransaccion, saveAsistencia, loading } = useSupabaseData();
  const { showToast } = useToast();
  
  const [scannedAlumno, setScannedAlumno] = useState(null);
  const [warningAlumno, setWarningAlumno] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleScan = (result) => {
    // The library returns an array of objects
    if (result && result.length > 0 && !isPaused) {
      const rawValue = result[0].rawValue;
      
      // Support two formats:
      // 1. Full URL: https://domain/alumno/1  (new QR format)
      // 2. Plain number: RT-2026-001           (legacy fallback)
      let alumno = null;

      const urlMatch = rawValue.match(/\/alumno\/([a-zA-Z0-9-]+)/);
      if (urlMatch) {
        const id = urlMatch[1];
        alumno = alumnos.find(a => a.id === id);
      } else {
        // Fallback: try matching by numero
        alumno = alumnos.find(a => a.numero === rawValue);
      }
      
      if (alumno) {
        setIsPaused(true);
        
        const hoy = new Date().toISOString().split('T')[0];
        const yaAsistio = transacciones.some(t => 
          t.alumnoId === alumno.id && 
          t.fecha.startsWith(hoy) && 
          t.tipo === 'acreditar' &&
          (t.motivo.includes('Puntualidad') || t.motivo.includes('Tarde'))
        );

        if (yaAsistio) {
          setWarningAlumno(alumno);
          return;
        }

        setScannedAlumno(alumno);
      } else {
        setIsPaused(true);
        showToast('Código no válido o alumno no encontrado.', 'error');
        // Resume scanning after 2 seconds
        setTimeout(() => setIsPaused(false), 2000);
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleAcreditarSubmit = async (total, motivoText) => {
    try {
      // 1. Acreditar los Royales
      addTransaccion(scannedAlumno.id, 'acreditar', total, motivoText);
      showToast(`${total} Royales acreditados a ${scannedAlumno.nombre}`);
      
      // 2. Registrar asistencia automática
      const hoy = new Date().toISOString().split('T')[0];
      await saveAsistencia(hoy, [{ alumno_id: scannedAlumno.id, presente: true }]);
    } catch (err) {
      console.error("Error en pase rápido:", err);
      showToast('Ocurrió un error en el registro', 'error');
    } finally {
      // Close modal and resume scanning
      setScannedAlumno(null);
      setTimeout(() => setIsPaused(false), 1000);
    }
  };

  const overrideWarning = () => {
    setScannedAlumno(warningAlumno);
    setWarningAlumno(null);
  };

  const cancelWarning = () => {
    setWarningAlumno(null);
    setTimeout(() => setIsPaused(false), 1000);
  };

  const handleCancel = () => {
    setScannedAlumno(null);
    setIsPaused(false);
  };

  return (
    <AdminShell title="Escáner" eyebrow="Pase Rápido" backTo="/admin">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem', paddingBottom: '2rem' }}>
        
        <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '0.875rem' }}>
          Apunta al código QR del carnet del alumno. El pase de asistencia se abrirá automáticamente.
        </p>

        <div style={{ 
          background: '#000', 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-2)',
          position: 'relative'
        }}>
          {!isPaused ? (
            <Scanner 
              onScan={handleScan}
              onError={handleError}
              formats={['qr_code']}
              styles={{
                container: { width: '100%', height: '100%' },
                video: { objectFit: 'cover' }
              }}
            />
          ) : (
            <div style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>
              {scannedAlumno ? 'Alumno detectado...' : 'Pausado...'}
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={!!warningAlumno} 
        onClose={cancelWarning}
        title=""
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'color-mix(in srgb, var(--danger) 15%, transparent)', color: 'var(--danger)', marginBottom: '1rem' }}>
            <AlertTriangle size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text)', fontWeight: 800 }}>¡Asistencia Duplicada!</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
            <strong>{warningAlumno?.nombre}</strong> ya tiene asistencia registrada el día de hoy. ¿Deseas escanearlo de todas formas?
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button 
              onClick={cancelWarning}
              className="royal-button royal-button--gold"
              style={{ justifyContent: 'center' }}
            >
              Cancelar
            </button>
            <button 
              onClick={overrideWarning}
              className="royal-button"
              style={{ justifyContent: 'center', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', boxShadow: 'none' }}
            >
              Sí, abrir
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={!!scannedAlumno} 
        onClose={handleCancel}
        title={scannedAlumno ? `Acreditar a ${scannedAlumno.nombre}` : ''}
      >
        {scannedAlumno && (
          <AcreditarForm onSubmit={handleAcreditarSubmit} />
        )}
      </Modal>

    </AdminShell>
  );
}
