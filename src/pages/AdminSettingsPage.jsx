import { useState } from 'react'
import { KeyRound, Save, ClipboardCheck, ScrollText, Package, IdCard, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import { supabase } from '../lib/supabase.js'
import { useToast } from '../contexts/ToastContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    
    if (newPassword.length < 6) {
      return showToast('La contraseña debe tener al menos 6 caracteres', 'error')
    }
    
    if (newPassword !== confirmPassword) {
      return showToast('Las contraseñas no coinciden', 'error')
    }

    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      showToast('Contraseña actualizada correctamente', 'success')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      showToast('Error al actualizar la contraseña', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminShell backTo="/admin" 
      title="Ajustes de Cuenta" 
      eyebrow="Configuración"
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Menu de Herramientas */}
        <RoyalFrame style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Herramientas del Sistema</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>Gestiona la asistencia, transacciones, catálogo y carnets.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            
            <Link to="/admin/asistencia" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--line)', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor='var(--primary-700)'} onMouseLeave={e => e.currentTarget.style.borderColor='var(--line)'}>
                <div style={{ background: 'var(--primary-100)', color: 'var(--primary-900)', padding: '0.75rem', borderRadius: '8px', display: 'flex' }}>
                  <ClipboardCheck size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>Asistencia</h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Pase de lista y registro</p>
                </div>
                <ChevronRight size={20} color="var(--muted)" />
              </div>
            </Link>

            <Link to="/admin/transacciones" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--line)', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor='var(--primary-700)'} onMouseLeave={e => e.currentTarget.style.borderColor='var(--line)'}>
                <div style={{ background: 'var(--primary-100)', color: 'var(--primary-900)', padding: '0.75rem', borderRadius: '8px', display: 'flex' }}>
                  <ScrollText size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>Historial</h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Log de transacciones</p>
                </div>
                <ChevronRight size={20} color="var(--muted)" />
              </div>
            </Link>

            <Link to="/admin/premios" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--line)', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor='var(--primary-700)'} onMouseLeave={e => e.currentTarget.style.borderColor='var(--line)'}>
                <div style={{ background: 'var(--primary-100)', color: 'var(--primary-900)', padding: '0.75rem', borderRadius: '8px', display: 'flex' }}>
                  <Package size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>Premios</h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Catálogo e inventario</p>
                </div>
                <ChevronRight size={20} color="var(--muted)" />
              </div>
            </Link>

            <Link to="/admin/carnets" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--line)', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.borderColor='var(--primary-700)'} onMouseLeave={e => e.currentTarget.style.borderColor='var(--line)'}>
                <div style={{ background: 'var(--primary-100)', color: 'var(--primary-900)', padding: '0.75rem', borderRadius: '8px', display: 'flex' }}>
                  <IdCard size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text)' }}>Carnets</h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Generación de tarjetas QR</p>
                </div>
                <ChevronRight size={20} color="var(--muted)" />
              </div>
            </Link>

          </div>
        </RoyalFrame>
        <RoyalFrame style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text)' }}>
            <KeyRound size={24} color="var(--accent-500)" />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Cambiar Contraseña</h2>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--surface-warm)', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.9rem', color: 'var(--text)' }}>
            Estás conectado como: <strong>{user?.email}</strong>
          </div>

          <form onSubmit={handleUpdatePassword} style={{ display: 'grid', gap: '1rem' }}>
            <label className="form-group">
              <span>Nueva Contraseña</span>
              <input 
                required
                type="password"
                className="royal-input" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </label>

            <label className="form-group">
              <span>Confirmar Contraseña</span>
              <input 
                required
                type="password"
                className="royal-input" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                minLength={6}
              />
            </label>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                className="royal-button royal-button--gold"
                disabled={isSaving || !newPassword || !confirmPassword}
              >
                {isSaving ? (
                  'Actualizando...'
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </RoyalFrame>

      </div>
    </AdminShell>
  )
}
