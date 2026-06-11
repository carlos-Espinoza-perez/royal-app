import { createContext, useContext, useState, useEffect } from 'react';
import { alumnos as initialAlumnos, transacciones as initialTransacciones } from '../data/mockData.js';

const MockDataContext = createContext();

export function MockDataProvider({ children }) {
  // Use localStorage to persist the mock data across reloads
  const [alumnos, setAlumnos] = useState(() => {
    const saved = localStorage.getItem('royal_alumnos');
    return saved ? JSON.parse(saved) : initialAlumnos;
  });

  const [transacciones, setTransacciones] = useState(() => {
    const saved = localStorage.getItem('royal_transacciones');
    return saved ? JSON.parse(saved) : initialTransacciones;
  });

  useEffect(() => {
    localStorage.setItem('royal_alumnos', JSON.stringify(alumnos));
  }, [alumnos]);

  useEffect(() => {
    localStorage.setItem('royal_transacciones', JSON.stringify(transacciones));
  }, [transacciones]);

  // Actions
  const addAlumno = (nombre) => {
    const year = new Date().getFullYear();
    const count = alumnos.length + 1;
    const numero = `RT-${year}-${String(count).padStart(3, '0')}`;

    const newAlumno = {
      id: crypto.randomUUID(),
      nombre,
      numero,
      saldo: 0,
      activo: true,
      fotoUrl: '',
      rachaDomingos: 0,
    };
    setAlumnos(prev => [...prev, newAlumno]);
    return newAlumno;
  };

  const addTransaccion = (alumnoId, tipo, monto, motivo) => {
    // 1. Create transaction
    const newTx = {
      id: 'tx-' + crypto.randomUUID().slice(0, 6),
      alumnoId,
      tipo,
      monto: Number(monto),
      motivo,
      fecha: new Date().toISOString(),
    };
    
    // 2. Update transaction list
    setTransacciones(prev => [newTx, ...prev]);

    // 3. Update student balance
    setAlumnos(prev => prev.map(alumno => {
      if (alumno.id === alumnoId) {
        const modificador = tipo === 'acreditar' ? Number(monto) : -Number(monto);
        return { ...alumno, saldo: Math.max(0, alumno.saldo + modificador) };
      }
      return alumno;
    }));

    return newTx;
  };

  const deleteTransaccion = (txId) => {
    const tx = transacciones.find(t => t.id === txId);
    if (!tx) return;

    setTransacciones(prev => prev.filter(t => t.id !== txId));

    setAlumnos(prev => prev.map(alumno => {
      if (alumno.id === tx.alumnoId) {
        const modificador = tx.tipo === 'acreditar' ? -Number(tx.monto) : Number(tx.monto);
        return { ...alumno, saldo: Math.max(0, alumno.saldo + modificador) };
      }
      return alumno;
    }));
  };

  const editTransaccion = (txId, newMonto, newMotivo) => {
    const tx = transacciones.find(t => t.id === txId);
    if (!tx) return;

    const oldMonto = Number(tx.monto);
    const monto = Number(newMonto);

    setTransacciones(prev => prev.map(t => t.id === txId ? { ...t, monto, motivo: newMotivo } : t));

    setAlumnos(prev => prev.map(alumno => {
      if (alumno.id === tx.alumnoId) {
        let modificador = 0;
        if (tx.tipo === 'acreditar') {
          modificador = monto - oldMonto;
        } else {
          modificador = oldMonto - monto;
        }
        return { ...alumno, saldo: Math.max(0, alumno.saldo + modificador) };
      }
      return alumno;
    }));
  };

  return (
    <MockDataContext.Provider value={{ alumnos, transacciones, addAlumno, addTransaccion, deleteTransaccion, editTransaccion }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  return useContext(MockDataContext);
}
