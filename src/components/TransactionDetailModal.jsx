import { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import { useSupabaseData } from '../contexts/SupabaseDataContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { useConfirm } from '../contexts/ConfirmContext.jsx';
import { formatDate, formatRoyales } from '../utils/formatters.js';
import { Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';

export default function TransactionDetailModal({ transaccion, isOpen, onClose }) {
  const { deleteTransaccion, editTransaccion } = useSupabaseData();
  const { showToast } = useToast();
  const confirm = useConfirm();
  
  const [isEditing, setIsEditing] = useState(false);
  const [monto, setMonto] = useState('');
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    if (transaccion) {
      setMonto(transaccion.monto);
      setMotivo(transaccion.motivo);
      setIsEditing(false);
    }
  }, [transaccion, isOpen]);

  if (!transaccion) return null;

  const txDate = new Date(transaccion.fecha);
  const now = new Date();
  const diffTime = Math.abs(now - txDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isEditable = diffDays <= 14;

  const handleDelete = async () => {
    const isConfirmed = await confirm('¿Estás seguro de que deseas eliminar esta transacción? Esta acción revertirá el saldo del alumno.', {
      title: 'Eliminar Transacción',
      confirmText: 'Sí, eliminar',
      isDestructive: true
    });
    
    if (isConfirmed) {
      deleteTransaccion(transaccion.id);
      showToast('Transacción eliminada con éxito');
      onClose();
    }
  };

  const handleSaveEdit = () => {
    if (!monto || !motivo) return;
    editTransaccion(transaccion.id, monto, motivo);
    showToast('Transacción editada con éxito');
    setIsEditing(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de Transacción">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <strong style={{ fontSize: '2rem', color: transaccion.tipo === 'acreditar' ? 'var(--success)' : 'var(--danger)' }}>
            {transaccion.tipo === 'acreditar' ? '+' : '-'}{formatRoyales(transaccion.monto)} Royales
          </strong>
          <div style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {formatDate(transaccion.fecha)}
          </div>
        </div>

        {!isEditing ? (
          <>
            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <small style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>Motivo</small>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600 }}>{transaccion.motivo}</p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <small style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>Tipo de operación</small>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, textTransform: 'capitalize' }}>{transaccion.tipo}</p>
            </div>

            {isEditable ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="royal-button" 
                  style={{ background: 'var(--background)', color: 'var(--text)', border: '1px solid var(--line)', boxShadow: 'none' }}
                >
                  <Edit2 size={16} /> Editar
                </button>
                <button 
                  onClick={handleDelete}
                  className="royal-button" 
                  style={{ background: 'var(--background)', color: 'var(--danger)', border: '1px solid var(--danger)', boxShadow: 'none' }}
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem', marginTop: '1rem', padding: '0.5rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
                Esta transacción tiene más de 14 días y ya no puede ser editada ni eliminada.
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div className="modal-form-group">
              <label>Monto</label>
              <input 
                type="number" 
                min="1"
                value={monto} 
                onChange={(e) => setMonto(e.target.value)} 
              />
            </div>
            <div className="modal-form-group">
              <label>Motivo</label>
              <input 
                value={motivo} 
                onChange={(e) => setMotivo(e.target.value)} 
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setIsEditing(false)}
                className="royal-button" 
                style={{ background: 'var(--background)', color: 'var(--text)', border: '1px solid var(--line)', boxShadow: 'none' }}
              >
                <XCircle size={16} /> Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
                className="royal-button royal-button--gold" 
              >
                <CheckCircle size={16} /> Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
