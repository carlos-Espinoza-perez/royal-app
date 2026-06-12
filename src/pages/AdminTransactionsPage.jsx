import { useState } from 'react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import HistorialItem from '../components/HistorialItem.jsx'
import TransactionDetailModal from '../components/TransactionDetailModal.jsx'
import { useSupabaseData } from '../contexts/SupabaseDataContext.jsx'

export default function AdminTransactionsPage() {
  const { alumnos, transacciones, loading } = useSupabaseData()
  const [filter, setFilter] = useState('todos')
  const [selectedTx, setSelectedTx] = useState(null)

  const items = transacciones
    .filter(t => filter === 'todos' || t.tipo === filter)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  return (
    <AdminShell backTo="/admin/ajustes" title="Historial global" eyebrow="Libro de movimientos">
      <RoyalFrame className="admin-panel">
        <div className="filter-strip" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button 
            onClick={() => setFilter('todos')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', background: filter === 'todos' ? 'var(--primary-700)' : 'transparent', color: filter === 'todos' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
          >Todos</button>
          <button 
            onClick={() => setFilter('acreditar')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', background: filter === 'acreditar' ? 'var(--primary-700)' : 'transparent', color: filter === 'acreditar' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
          >Acreditar</button>
          <button 
            onClick={() => setFilter('sancionar')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', background: filter === 'sancionar' ? 'var(--primary-700)' : 'transparent', color: filter === 'sancionar' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
          >Sancionar</button>
          <button 
            onClick={() => setFilter('canjear')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', background: filter === 'canjear' ? 'var(--primary-700)' : 'transparent', color: filter === 'canjear' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
          >Canjear</button>
        </div>
        <div className="history-list" style={{ marginTop: '1rem' }}>
          {items.map((transaccion) => {
            const alumno = alumnos.find((item) => item.id === transaccion.alumnoId)
            return (
              <div className="global-history-row" key={transaccion.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <small style={{ color: 'var(--primary-700)', fontWeight: 700, paddingLeft: '0.5rem' }}>{alumno?.nombre || 'Desconocido'}</small>
                <HistorialItem 
                  transaccion={transaccion} 
                  onClick={() => setSelectedTx(transaccion)}
                />
              </div>
            )
          })}
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
              No hay transacciones.
            </div>
          )}
        </div>
      </RoyalFrame>

      <TransactionDetailModal 
        transaccion={selectedTx} 
        isOpen={!!selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
    </AdminShell>
  )
}
