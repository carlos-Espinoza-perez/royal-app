import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const SupabaseDataContext = createContext();

export function SupabaseDataProvider({ children }) {
  const [dbAlumnos, setDbAlumnos] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [premios, setPremios] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Initial fetch
  useEffect(() => {
    if (!user) {
      setDbAlumnos([]);
      setTransacciones([]);
      setPremios([]);
      setAsistencia([]);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      
      const { data: alumnosData, error: alumnosError } = await supabase
        .from('alumnos')
        .select('*')
        .order('saldo', { ascending: false });
        
      if (alumnosError) console.error('Error fetching alumnos:', alumnosError);
      else setDbAlumnos(alumnosData.map(a => ({ ...a, fotoUrl: a.foto_url }))); // map snake_case to camelCase

      const { data: txData, error: txError } = await supabase
        .from('transacciones')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (txError) console.error('Error fetching transacciones:', txError);
      else setTransacciones(txData.map(t => ({ ...t, alumnoId: t.alumno_id, premioId: t.premio_id, fecha: t.created_at }))); // map to mock interface

      const { data: premiosData } = await supabase.from('premios').select('*');
      if (premiosData) setPremios(premiosData);

      const { data: asisData } = await supabase.from('asistencia').select('*');
      if (asisData) setAsistencia(asisData);

      setLoading(false);
    };

    fetchData();

    // Set up real-time subscription for table changes
    const channel = supabase
      .channel('public:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alumnos' }, (payload) => {
        setDbAlumnos((prev) => {
          if (payload.eventType === 'INSERT') return [...prev, { ...payload.new, fotoUrl: payload.new.foto_url }];
          if (payload.eventType === 'UPDATE') return prev.map(a => a.id === payload.new.id ? { ...payload.new, fotoUrl: payload.new.foto_url } : a);
          if (payload.eventType === 'DELETE') return prev.filter(a => a.id !== payload.old.id);
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transacciones' }, (payload) => {
        setTransacciones((prev) => {
          const formatted = { ...payload.new, alumnoId: payload.new.alumno_id, premioId: payload.new.premio_id, fecha: payload.new.created_at };
          if (payload.eventType === 'INSERT') return [formatted, ...prev];
          if (payload.eventType === 'UPDATE') return prev.map(t => t.id === payload.new.id ? formatted : t);
          if (payload.eventType === 'DELETE') return prev.filter(t => t.id !== payload.old.id);
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'premios' }, (payload) => {
        setPremios((prev) => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new];
          if (payload.eventType === 'UPDATE') return prev.map(p => p.id === payload.new.id ? payload.new : p);
          if (payload.eventType === 'DELETE') return prev.filter(p => p.id !== payload.old.id);
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'asistencia' }, (payload) => {
        setAsistencia((prev) => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new];
          if (payload.eventType === 'UPDATE') return prev.map(a => a.id === payload.new.id ? payload.new : a);
          if (payload.eventType === 'DELETE') return prev.filter(a => a.id !== payload.old.id);
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Derived state: Always calculate the 100% accurate balance based on the ledger
  const alumnos = useMemo(() => {
    return dbAlumnos.map(a => {
      const txs = transacciones.filter(t => t.alumnoId === a.id);
      const realSaldo = txs.reduce((sum, t) => {
        if (t.tipo === 'acreditar') return sum + t.monto;
        return sum - t.monto; // sancionar or canjear
      }, 0);
      return { ...a, saldo: Math.max(0, realSaldo) };
    }).sort((a, b) => b.saldo - a.saldo); // Keep them ordered by highest saldo
  }, [dbAlumnos, transacciones]);

  // Actions
  const addAlumno = async (nombre) => {
    const year = new Date().getFullYear();
    const count = dbAlumnos.length + 1;
    const numero = `RT-${year}-${String(count).padStart(3, '0')}`;

    const { data, error } = await supabase
      .from('alumnos')
      .insert([{ nombre, numero, saldo: 0, activo: true }])
      .select()
      .single();

    if (error) {
      console.error('Error adding alumno:', error);
      throw error;
    }
    return data;
  };

  const editAlumno = async (id, newNombre) => {
    const { error } = await supabase
      .from('alumnos')
      .update({ nombre: newNombre })
      .eq('id', id);

    if (error) {
      console.error('Error editing alumno:', error);
      throw error;
    }
  };

  const deleteAlumno = async (id) => {
    const { error } = await supabase
      .from('alumnos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting alumno:', error);
      throw error;
    }
  };

  const addTransaccion = async (alumnoId, tipo, monto, motivo, premioId = null) => {
    // The DB trigger handles the balance update, we just insert the tx
    const { data, error } = await supabase
      .from('transacciones')
      .insert([{ alumno_id: alumnoId, tipo, monto: Number(monto), motivo, premio_id: premioId }])
      .select()
      .single();

    if (error) {
      console.error('Error adding transaccion:', error);
      throw error;
    }
    return data;
  };

  const deleteTransaccion = async (txId) => {
    // Note: If you delete a transaction, the DB trigger does NOT automatically revert the balance.
    // A revert trigger on DELETE would be needed, or we just rely on admin to fix it.
    // For now, we just delete it.
    const { error } = await supabase
      .from('transacciones')
      .delete()
      .eq('id', txId);

    if (error) {
      console.error('Error deleting transaccion:', error);
      throw error;
    }
  };

  const editTransaccion = async (txId, newMonto, newMotivo) => {
    const { error } = await supabase
      .from('transacciones')
      .update({ monto: Number(newMonto), motivo: newMotivo })
      .eq('id', txId);

    if (error) {
      console.error('Error editing transaccion:', error);
      throw error;
    }
  };

  const addPremio = async (nombre, costo, stock, imagenUrl) => {
    const { data, error } = await supabase
      .from('premios')
      .insert([{ 
        nombre, 
        costo_royales: Number(costo), 
        stock: Number(stock), 
        imagen_url: imagenUrl 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const editPremio = async (id, updates) => {
    if (updates.costo) { updates.costo_royales = Number(updates.costo); delete updates.costo; }
    if (updates.imagenUrl) { updates.imagen_url = updates.imagenUrl; delete updates.imagenUrl; }

    const { error } = await supabase
      .from('premios')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  };

  const deletePremio = async (id) => {
    const { error } = await supabase
      .from('premios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  const saveAsistencia = async (fecha, records) => {
    // records: [{ alumno_id, presente }]
    const dataToInsert = records.map(r => ({
      alumno_id: r.alumno_id,
      fecha: fecha,
      presente: r.presente
    }));

    // Upsert uses the UNIQUE(alumno_id, fecha) constraint to update if exists
    const { error } = await supabase
      .from('asistencia')
      .upsert(dataToInsert, { onConflict: 'alumno_id,fecha' });

    if (error) throw error;
  };

  const addVisita = async (fecha, nombreVisita) => {
    const { error } = await supabase
      .from('asistencia')
      .insert([{ fecha, nombre_visita: nombreVisita, presente: true }]);
    if (error) throw error;
  };

  const removeVisita = async (id) => {
    const { error } = await supabase
      .from('asistencia')
      .delete()
      .eq('id', id);
    if (error) throw error;
  };

  return (
    <SupabaseDataContext.Provider value={{ 
      alumnos, 
      transacciones, 
      premios, 
      asistencia, 
      loading,
      addAlumno,
      editAlumno,
      deleteAlumno,
      addTransaccion, 
      deleteTransaccion, 
      editTransaccion,
      addPremio,
      editPremio,
      deletePremio,
      saveAsistencia,
      addVisita,
      removeVisita
    }}>
      {children}
    </SupabaseDataContext.Provider>
  );
}

export function useSupabaseData() {
  return useContext(SupabaseDataContext);
}
