import { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((current) => current?.id === toast?.id ? null : current);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: toast.type === 'success' ? 'var(--success)' : 'var(--danger)',
          color: '#fff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 500,
          fontSize: '0.875rem',
          animation: 'slideUp 0.3s ease forwards'
        }}>
          {toast.message}
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'grid', placeItems: 'center' }}>
            <X size={16} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
