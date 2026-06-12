import { useState } from 'react'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import Modal from '../components/Modal.jsx'
import { useSupabaseData } from '../contexts/SupabaseDataContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import { useConfirm } from '../contexts/ConfirmContext.jsx'
import { formatRoyales } from '../utils/formatters.js'

export default function AdminRewardsPage() {
  const { premios, addPremio, editPremio, deletePremio } = useSupabaseData()
  const { showToast } = useToast()
  const confirm = useConfirm()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPremio, setCurrentPremio] = useState(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    costo: '',
    stock: '',
    imagenUrl: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openNewModal = () => {
    setIsEditing(false)
    setCurrentPremio(null)
    setFormData({ nombre: '', costo: '', stock: '', imagenUrl: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (premio) => {
    setIsEditing(true)
    setCurrentPremio(premio)
    setFormData({
      nombre: premio.nombre,
      costo: premio.costo_royales,
      stock: premio.stock,
      imagenUrl: premio.imagen_url || ''
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      if (isEditing) {
        await editPremio(currentPremio.id, formData)
        showToast('Premio actualizado correctamente', 'success')
      } else {
        await addPremio(
          formData.nombre,
          formData.costo,
          formData.stock,
          formData.imagenUrl
        )
        showToast('Premio creado correctamente', 'success')
      }
      setIsModalOpen(false)
    } catch (error) {
      showToast('Error al guardar el premio', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSeed = async () => {
    setIsSubmitting(true)
    const premiosPorDefecto = [
      { nombre: 'Biblia de Estudio', costo: 1500, stock: 10, imagenUrl: '' },
      { nombre: 'Cena con los Líderes', costo: 2000, stock: 5, imagenUrl: '' },
      { nombre: 'Libreta de Notas', costo: 200, stock: 20, imagenUrl: '' },
      { nombre: 'Dulces y Snacks', costo: 50, stock: 100, imagenUrl: '' },
      { nombre: 'Entrada al Campamento', costo: 5000, stock: 2, imagenUrl: '' }
    ]
    try {
      for (const p of premiosPorDefecto) {
        await addPremio(p.nombre, p.costo, p.stock, p.imagenUrl)
      }
      showToast('Premios por defecto añadidos con éxito', 'success')
    } catch (error) {
      showToast('Error al añadir premios', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('¿Seguro que deseas eliminar este premio del catálogo?', {
      title: 'Eliminar Premio',
      confirmText: 'Sí, eliminar',
      isDestructive: true
    })
    
    if (isConfirmed) {
      try {
        await deletePremio(id)
        showToast('Premio eliminado', 'success')
      } catch (error) {
        showToast('Error al eliminar', 'error')
      }
    }
  }

  return (
    <AdminShell backTo="/admin/ajustes" 
      title="Catálogo de Premios" 
      eyebrow="Tienda"
      actions={
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="royal-button royal-button--outline" onClick={handleSeed} disabled={isSubmitting}>
            <Package size={18} />
            Poblar DB
          </button>
          <button className="royal-button royal-button--gold" onClick={openNewModal}>
            <Plus size={18} />
            Nuevo Premio
          </button>
        </div>
      }
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '1rem'
      }}>
        {premios.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <Package size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p style={{ marginBottom: '1rem' }}>El catálogo está vacío. Añade premios para que los alumnos puedan canjearlos.</p>
            <button 
              className="royal-button" 
              style={{ margin: '0 auto', background: 'var(--primary-100)', color: 'var(--primary-800)' }}
              onClick={handleSeed}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Insertando...' : 'Insertar Premios por Defecto'}
            </button>
          </div>
        ) : (
          premios.map(premio => (
            <RoyalFrame key={premio.id} style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{
                height: '160px',
                background: premio.imagen_url ? `url(${premio.imagen_url}) center/cover` : 'var(--primary-100)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--primary-300)',
                borderBottom: '1px solid var(--line)'
              }}>
                {!premio.imagen_url && <Package size={40} />}
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>{premio.nombre}</h3>
                  <strong style={{ color: 'var(--accent-600)', fontSize: '1.1rem' }}>{formatRoyales(premio.costo_royales)}</strong>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
                  <span style={{ fontSize: '0.8rem', color: premio.stock > 0 ? 'var(--text)' : 'var(--error)', fontWeight: 600 }}>
                    {premio.stock > 0 ? `Stock: ${premio.stock}` : 'Agotado'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => openEditModal(premio)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary-500)', cursor: 'pointer', padding: '0.25rem' }}
                      aria-label="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(premio.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '0.25rem' }}
                      aria-label="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </RoyalFrame>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={isEditing ? 'Editar Premio' : 'Nuevo Premio'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <label className="form-group">
            <span>Nombre del premio</span>
            <input 
              required
              className="royal-input" 
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
              placeholder="Ej. Biblia de estudio"
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label className="form-group">
              <span>Costo (Royales)</span>
              <input 
                required
                type="number"
                min="1"
                className="royal-input" 
                value={formData.costo}
                onChange={e => setFormData({...formData, costo: e.target.value})}
              />
            </label>
            <label className="form-group">
              <span>Stock Inicial</span>
              <input 
                required
                type="number"
                min="0"
                className="royal-input" 
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
              />
            </label>
          </div>

          <label className="form-group">
            <span>URL de Imagen (Opcional)</span>
            <input 
              type="url"
              className="royal-input" 
              value={formData.imagenUrl}
              onChange={e => setFormData({...formData, imagenUrl: e.target.value})}
              placeholder="https://..."
            />
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button 
              type="button" 
              className="royal-button" 
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="royal-button royal-button--gold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Premio'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminShell>
  )
}
