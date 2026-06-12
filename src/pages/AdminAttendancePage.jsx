import { useState, useEffect } from 'react'
import { Calendar, Save, CheckCircle2, Circle, Trash2, UserPlus } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import { useSupabaseData } from '../contexts/SupabaseDataContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'

export default function AdminAttendancePage() {
  const { alumnos, asistencia, saveAsistencia, addVisita, removeVisita } = useSupabaseData()
  const { showToast } = useToast()

  // Set default to today's date in local YYYY-MM-DD
  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState(today)
  const [attendanceState, setAttendanceState] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [newVisitaName, setNewVisitaName] = useState('')
  const [isAddingVisita, setIsAddingVisita] = useState(false)

  // Solo mostrar alumnos activos
  const activeAlumnos = alumnos.filter(a => a.activo).sort((a, b) => a.nombre.localeCompare(b.nombre))

  // Sincronizar estado cuando cambia la fecha o se cargan datos de la DB
  useEffect(() => {
    const recordsForDate = asistencia.filter(a => a.fecha === selectedDate)
    
    const newState = {}
    activeAlumnos.forEach(alumno => {
      const record = recordsForDate.find(r => r.alumno_id === alumno.id)
      // Si hay registro, usamos su valor. Si no, false por defecto.
      newState[alumno.id] = record ? record.presente : false
    })
    
    setAttendanceState(newState)
  }, [selectedDate, asistencia, alumnos])

  const recordsForDate = asistencia.filter(a => a.fecha === selectedDate)
  const visitas = recordsForDate.filter(a => !a.alumno_id)

  const toggleStudent = (id) => {
    setAttendanceState(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const markAll = (status) => {
    const newState = {}
    activeAlumnos.forEach(a => newState[a.id] = status)
    setAttendanceState(newState)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const recordsToSave = Object.keys(attendanceState).map(alumno_id => ({
        alumno_id,
        presente: attendanceState[alumno_id]
      }))

      await saveAsistencia(selectedDate, recordsToSave)
      showToast('Pase de lista guardado con éxito', 'success')
    } catch (error) {
      console.error(error)
      showToast('Error al guardar el pase de lista', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddVisita = async (e) => {
    e.preventDefault()
    if (!newVisitaName.trim()) return
    setIsAddingVisita(true)
    try {
      await addVisita(selectedDate, newVisitaName.trim())
      setNewVisitaName('')
      showToast('Visita registrada', 'success')
    } catch (err) {
      console.error(err)
      showToast('Error al registrar visita', 'error')
    } finally {
      setIsAddingVisita(false)
    }
  }

  const handleDeleteVisita = async (id) => {
    if (!window.confirm('¿Eliminar esta visita?')) return
    try {
      await removeVisita(id)
      showToast('Visita eliminada', 'success')
    } catch (err) {
      console.error(err)
      showToast('Error al eliminar', 'error')
    }
  }

  const presentCount = Object.values(attendanceState).filter(Boolean).length + visitas.length
  const totalCount = activeAlumnos.length + visitas.length

  return (
    <AdminShell 
      title="Pase de Lista" 
      eyebrow="Control de Asistencia"
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Controls Bar */}
        <div style={{ 
          display: 'grid', 
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          {/* Fila superior: Fecha */}
          <RoyalFrame style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '40px', height: '40px', 
              borderRadius: '10px', 
              background: 'var(--primary-100)', 
              display: 'grid', placeItems: 'center',
              color: 'var(--primary-600)'
            }}>
              <Calendar size={20} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', fontWeight: 600 }}>Fecha de la clase</span>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'var(--text)', 
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  outline: 'none',
                  padding: 0,
                  cursor: 'pointer'
                }}
              />
            </div>
          </RoyalFrame>

          {/* Fila inferior: Botones de acción rápida */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button 
              onClick={() => markAll(true)}
              style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                color: '#10b981', 
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 200ms'
              }}
            >
              ✓ Marcar todos
            </button>
            <button 
              onClick={() => markAll(false)}
              style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444', 
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 200ms'
              }}
            >
              ✕ Desmarcar todos
            </button>
          </div>
        </div>

        {/* List */}
        <RoyalFrame style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ 
            padding: '1rem 1.25rem', 
            background: 'var(--primary-50)', 
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>
              Lista Oficial ({activeAlumnos.length})
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-700)' }}>
              Total presentes: <strong>{presentCount}</strong>
            </span>
          </div>

          <div style={{ display: 'grid' }}>
            {activeAlumnos.map((alumno, index) => (
              <label 
                key={alumno.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderBottom: index < activeAlumnos.length - 1 ? '1px solid var(--line)' : 'none',
                  background: attendanceState[alumno.id] ? 'var(--primary-50)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 200ms'
                }}
              >
                <div onClick={(e) => { e.preventDefault(); toggleStudent(alumno.id); }}>
                  {attendanceState[alumno.id] ? (
                    <CheckCircle2 size={24} color="var(--primary-600)" />
                  ) : (
                    <Circle size={24} color="var(--line)" />
                  )}
                </div>
                
                <div style={{ flex: 1, display: 'grid' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{alumno.nombre}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{alumno.numero}</span>
                </div>
              </label>
            ))}
            
            {activeAlumnos.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                No hay alumnos activos para mostrar.
              </div>
            )}
          </div>
          
          {/* SECCIÓN VISITAS TEMPORALES */}
          <div style={{ 
            padding: '1rem 1.25rem', 
            background: 'color-mix(in srgb, var(--accent-500) 10%, transparent)', 
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 800, color: 'var(--accent-700)' }}>
              Visitas Temporales ({visitas.length})
            </span>
          </div>
          
          <div style={{ display: 'grid' }}>
            {visitas.map((visita, index) => (
              <div 
                key={visita.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--line)',
                  background: 'var(--surface)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle2 size={24} color="var(--accent-500)" />
                  <div style={{ display: 'grid' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{visita.nombre_visita}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Visita / Invitado</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteVisita(visita.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            
            <form onSubmit={handleAddVisita} style={{ display: 'flex', gap: '0.5rem', padding: '1rem 1.25rem', background: 'var(--background)' }}>
              <input 
                type="text" 
                placeholder="Nombre de la visita..."
                value={newVisitaName}
                onChange={e => setNewVisitaName(e.target.value)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', fontSize: '0.9rem' }}
              />
              <button 
                type="submit" 
                disabled={isAddingVisita || !newVisitaName.trim()}
                style={{ 
                  background: 'var(--accent-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0 1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' 
                }}
              >
                <UserPlus size={16} /> Añadir
              </button>
            </form>
          </div>
        </RoyalFrame>

        {/* Save Bar (Static) */}
        <div style={{ marginTop: '12px' }}>
          <button 
            className="royal-button royal-button--gold" 
            onClick={handleSave}
            disabled={isSaving || activeAlumnos.length === 0}
            style={{ 
              width: '100%', 
              justifyContent: 'center',
              padding: '1rem', 
              fontSize: '1.05rem', 
              boxShadow: '0 4px 15px rgba(185,141,69,0.35)',
              minHeight: '56px',
              gap: '0.75rem'
            }}
          >
            <Save size={20} />
            {isSaving ? 'Guardando Asistencia...' : 'Guardar Asistencia'}
          </button>
        </div>
      </div>
    </AdminShell>
  )
}
