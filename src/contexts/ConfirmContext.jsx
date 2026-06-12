import { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/Modal.jsx';

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({});
  const [resolver, setResolver] = useState(null);

  const confirm = useCallback((message, config = {}) => {
    return new Promise((resolve) => {
      setOptions({ message, ...config });
      setResolver(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    if (resolver) resolver(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolver) resolver(false);
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal 
        isOpen={isOpen} 
        onClose={handleCancel} 
        title={options.title || 'Confirmación'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ margin: 0, color: 'var(--text)', fontSize: '1.05rem', lineHeight: '1.5' }}>
            {options.message}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button 
              className="royal-button" 
              style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--line)' }} 
              onClick={handleCancel}
            >
              {options.cancelText || 'Cancelar'}
            </button>
            <button 
              className={`royal-button ${options.isDestructive ? '' : 'royal-button--gold'}`} 
              style={options.isDestructive ? { background: 'var(--error)', color: 'white', border: 'none' } : {}}
              onClick={handleConfirm}
            >
              {options.confirmText || 'Confirmar'}
            </button>
          </div>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
