import { useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgePlus, Gift, QrCode, ShieldMinus, Edit2, Trash2, AlertTriangle } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import RangoInsignia from '../components/RangoInsignia.jsx'
import HistorialItem from '../components/HistorialItem.jsx'
import Modal from '../components/Modal.jsx'
import AcreditarForm from '../components/AcreditarForm.jsx'
import TransactionDetailModal from '../components/TransactionDetailModal.jsx'
import { getRangoBySaldo } from '../data/mockData.js'
import { formatRoyales } from '../utils/formatters.js'
import { useSupabaseData } from '../contexts/SupabaseDataContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import QRCodeGenerator from 'qrcode'

export default function AdminStudentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { alumnos, transacciones: allTransacciones, addTransaccion, editAlumno, deleteAlumno, loading } = useSupabaseData()
  const { showToast } = useToast()

  const [activeModal, setActiveModal] = useState(null)
  const [monto, setMonto] = useState('')
  const [motivo, setMotivo] = useState('')
  const [selectedTx, setSelectedTx] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [newName, setNewName] = useState('')

  const alumno = alumnos.find(a => a.id === id)
  const transacciones = allTransacciones
    .filter(t => t.alumnoId === id)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  if (!alumno) return <Navigate to="/admin/alumnos" />

  const handleOpenQR = async () => {
    try {
      const publicUrl = `${window.location.origin}/alumno/${alumno.id}`
      const url = await QRCodeGenerator.toDataURL(publicUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#0A1F24', light: '#ffffff' }
      })
      setQrDataUrl(url)
      setActiveModal('qr')
    } catch (err) {
      console.error(err)
    }
  }

  const handleOpenEdit = () => {
    setNewName(alumno.nombre)
    setActiveModal('editName')
  }

  const handleEditNameSubmit = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    await editAlumno(alumno.id, newName.trim())
    showToast('Nombre actualizado correctamente')
    setActiveModal(null)
  }

  const handleDeleteSubmit = async () => {
    try {
      await deleteAlumno(alumno.id)
      showToast('Alumno eliminado correctamente')
      navigate('/admin/alumnos')
    } catch (err) {
      showToast('Ocurrió un error al eliminar', 'error')
      setActiveModal(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!monto || !motivo) return
    
    addTransaccion(alumno.id, activeModal, monto, motivo)
    
    const actionText = activeModal === 'sancionar' ? 'descontados de' : 'canjeados por'
    showToast(`${monto} Royales ${actionText} ${alumno.nombre}`)
    
    setActiveModal(null)
    setMonto('')
    setMotivo('')
  }

  const handleAcreditarSubmit = (total, motivoText) => {
    addTransaccion(alumno.id, 'acreditar', total, motivoText)
    showToast(`${total} Royales acreditados a ${alumno.nombre}`)
    setActiveModal(null)
  }

  const modalTitles = {
    acreditar: 'Acreditar Royales',
    sancionar: 'Sancionar',
    canjear: 'Canjear Premio'
  }

  const headerActions = (
    <>
      <button className="icon-button" onClick={handleOpenEdit} aria-label="Editar Nombre" style={{ color: 'var(--text)' }}>
        <Edit2 size={20} />
      </button>
      <button className="icon-button" onClick={() => setActiveModal('delete')} aria-label="Eliminar Alumno" style={{ color: 'var(--danger)' }}>
        <Trash2 size={20} />
      </button>
    </>
  )

  return (
    <AdminShell 
      title={alumno.nombre} 
      eyebrow="Expediente del alumno" 
      backTo="/admin/alumnos"
      actions={headerActions}
    >
      <RoyalFrame className="admin-panel detail-panel" style={{ background: 'var(--surface)' }}>
        <div className="detail-hero">
          <div className="avatar-large">{alumno.nombre.slice(0, 1)}</div>
          <div>
            <span>{alumno.numero}</span>
            <h2>{formatRoyales(alumno.saldo)} Royales</h2>
            <RangoInsignia rango={getRangoBySaldo(alumno.saldo)} />
          </div>
        </div>
        <div className="action-grid">
          <button className="royal-button" onClick={() => setActiveModal('acreditar')}><BadgePlus size={16} /> Acreditar</button>
          <button className="royal-button" onClick={() => setActiveModal('sancionar')}><ShieldMinus size={16} /> Sancionar</button>
          <button className="royal-button" onClick={() => setActiveModal('canjear')}><Gift size={16} /> Canjear</button>
          <button className="royal-button" onClick={handleOpenQR}><QrCode size={16} /> Ver QR</button>
        </div>
      </RoyalFrame>

      <RoyalFrame className="admin-panel">
        <div className="section-title"><h2>Historial del alumno</h2></div>
        <div className="history-list">
          {transacciones.map((transaccion) => (
            <HistorialItem 
              key={transaccion.id} 
              transaccion={transaccion} 
              onClick={() => setSelectedTx(transaccion)}
            />
          ))}
          {transacciones.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
              Aún no hay transacciones.
            </div>
          )}
        </div>
      </RoyalFrame>

      <Modal 
        isOpen={activeModal === 'acreditar'} 
        onClose={() => setActiveModal(null)} 
        title="Acreditar Royales"
      >
        <AcreditarForm onSubmit={handleAcreditarSubmit} />
      </Modal>

      <Modal 
        isOpen={['sancionar', 'canjear'].includes(activeModal)} 
        onClose={() => { setActiveModal(null); setMonto(''); setMotivo(''); }} 
        title={modalTitles[activeModal]}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="modal-form-group">
            <label>Monto (Royales)</label>
            <input 
              type="number"
              min="1"
              required
              placeholder="Ej. 50" 
              value={monto} 
              onChange={e => setMonto(e.target.value)} 
              autoFocus
            />
          </div>
          <div className="modal-form-group">
            <label>Concepto / Motivo</label>
            <input 
              required
              placeholder="Ej. Uso de celular" 
              value={motivo} 
              onChange={e => setMotivo(e.target.value)} 
            />
          </div>
          <button type="submit" className="royal-button royal-button--gold" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
            Confirmar Operación
          </button>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'qr'} onClose={() => setActiveModal(null)} title="Código QR">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <img src={qrDataUrl} alt={`QR ${alumno.numero}`} style={{ borderRadius: '12px', width: '200px', height: '200px' }} />
          <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '0.875rem' }}>
            Escanea este código para acceder rápidamente al perfil de <strong>{alumno.nombre}</strong>.
          </p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'editName'} onClose={() => setActiveModal(null)} title="Editar Nombre">
        <form onSubmit={handleEditNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="modal-form-group">
            <label>Nombre del Alumno</label>
            <input 
              required
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              autoFocus
            />
          </div>
          <button type="submit" className="royal-button royal-button--gold" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
            Guardar Cambios
          </button>
        </form>
      </Modal>

      <Modal isOpen={activeModal === 'delete'} onClose={() => setActiveModal(null)} title="">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'color-mix(in srgb, var(--danger) 15%, transparent)', color: 'var(--danger)', marginBottom: '1rem' }}>
            <AlertTriangle size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text)', fontWeight: 800 }}>¿Eliminar Alumno?</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.5 }}>
            Estás a punto de eliminar permanentemente a <strong>{alumno.nombre}</strong> y todo su historial de transacciones. Esta acción no se puede deshacer.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button 
              onClick={() => setActiveModal(null)}
              className="royal-button"
              style={{ justifyContent: 'center', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', boxShadow: 'none' }}
            >
              Cancelar
            </button>
            <button 
              onClick={handleDeleteSubmit}
              className="royal-button"
              style={{ justifyContent: 'center', background: 'var(--danger)', color: '#fff', boxShadow: 'none' }}
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </Modal>

      <TransactionDetailModal 
        transaccion={selectedTx} 
        isOpen={!!selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
    </AdminShell>
  )
}
