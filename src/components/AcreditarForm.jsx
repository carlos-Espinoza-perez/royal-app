import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function AcreditarForm({ onSubmit }) {
  const [puntualidad, setPuntualidad] = useState('on_time'); // 'on_time' | 'late' | null
  const [biblia, setBiblia] = useState(true);
  const [cuaderno, setCuaderno] = useState(true);
  const [versiculo, setVersiculo] = useState(true);
  const [cultos, setCultos] = useState(0);
  const [participacion, setParticipacion] = useState(false);
  const [cumpleanos, setCumpleanos] = useState(false);
  const [visita, setVisita] = useState(false);
  const [customMonto, setCustomMonto] = useState('');
  const [customMotivo, setCustomMotivo] = useState('');

  // Values map
  const valores = {
    on_time: 100,
    late: 50,
    biblia: 100,
    cuaderno: 50,
    versiculo: 50,
    culto: 100,
    participacion: 100,
    cumpleanos: 500,
    visita: 1000
  };

  const calculateTotal = () => {
    let total = 0;
    if (puntualidad === 'on_time') total += valores.on_time;
    if (puntualidad === 'late') total += valores.late;
    if (biblia) total += valores.biblia;
    if (cuaderno) total += valores.cuaderno;
    if (versiculo) total += valores.versiculo;
    total += (cultos * valores.culto);
    if (participacion) total += valores.participacion;
    if (cumpleanos) total += valores.cumpleanos;
    if (visita) total += valores.visita;
    
    const parsedCustom = parseInt(customMonto, 10);
    if (!isNaN(parsedCustom)) total += parsedCustom;

    return total;
  };

  const generateMotivo = () => {
    const motivos = [];
    if (puntualidad === 'on_time') motivos.push('Puntualidad (+100)');
    if (puntualidad === 'late') motivos.push('Llegada Tarde (+50)');
    if (biblia) motivos.push('Biblia física (+100)');
    if (cuaderno) motivos.push('Cuaderno/Apuntes (+50)');
    if (versiculo) motivos.push('Versículo (+50)');
    if (cultos > 0) motivos.push(`${cultos}x Culto Semanal (+${cultos * valores.culto})`);
    if (participacion) motivos.push('Participación (+100)');
    if (cumpleanos) motivos.push('Cumpleaños (+500)');
    if (visita) motivos.push('Bono Visita (+1000)');
    
    if (customMonto && customMotivo) {
      motivos.push(`${customMotivo} (+${customMonto})`);
    } else if (customMonto) {
      motivos.push(`Otro (+${customMonto})`);
    }

    return motivos.join(', ');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = calculateTotal();
    const motivoText = generateMotivo();
    
    if (total <= 0) return; // Prevent empty submit
    
    onSubmit(total, motivoText);
  };

  const total = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="acreditar-form">
      <div className="acreditar-grid">
        
        {/* Puntualidad Group */}
        <div className="acreditar-group">
          <small>Asistencia</small>
          <div className="toggle-row">
            <button 
              type="button" 
              className={`toggle-btn ${puntualidad === 'on_time' ? 'active' : ''}`}
              onClick={() => setPuntualidad(p => p === 'on_time' ? null : 'on_time')}
            >
              Puntualidad <span>+100</span>
            </button>
            <button 
              type="button" 
              className={`toggle-btn toggle-btn--warn ${puntualidad === 'late' ? 'active' : ''}`}
              onClick={() => setPuntualidad(p => p === 'late' ? null : 'late')}
            >
              Tarde <span>+50</span>
            </button>
          </div>
        </div>

        {/* Básicos */}
        <div className="acreditar-group">
          <small>Básicos de reunión</small>
          <div className="toggle-grid-2">
            <button type="button" className={`toggle-btn ${biblia ? 'active' : ''}`} onClick={() => setBiblia(!biblia)}>
              Biblia <span>+100</span>
            </button>
            <button type="button" className={`toggle-btn ${cuaderno ? 'active' : ''}`} onClick={() => setCuaderno(!cuaderno)}>
              Apuntes <span>+50</span>
            </button>
            <button type="button" className={`toggle-btn ${versiculo ? 'active' : ''}`} onClick={() => setVersiculo(!versiculo)}>
              Versículo <span>+50</span>
            </button>
            <button type="button" className={`toggle-btn ${participacion ? 'active' : ''}`} onClick={() => setParticipacion(!participacion)}>
              Participación <span>+100</span>
            </button>
          </div>
        </div>

        {/* Counter */}
        <div className="acreditar-group">
          <small>Culto Semanal (+100 c/u)</small>
          <div className="counter-row">
            <button type="button" onClick={() => setCultos(c => Math.max(0, c - 1))} disabled={cultos === 0}>
              <Minus size={18} />
            </button>
            <span className="counter-value">{cultos}</span>
            <button type="button" onClick={() => setCultos(c => c + 1)}>
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Bonos Especiales */}
        <div className="acreditar-group">
          <small>Bonos Especiales</small>
          <div className="toggle-row">
            <button type="button" className={`toggle-btn toggle-btn--gold ${cumpleanos ? 'active' : ''}`} onClick={() => setCumpleanos(!cumpleanos)}>
              Cumpleaños <span>+500</span>
            </button>
            <button type="button" className={`toggle-btn toggle-btn--gold ${visita ? 'active' : ''}`} onClick={() => setVisita(!visita)}>
              Visita Nueva <span>+1000</span>
            </button>
          </div>
        </div>

        {/* Extra Manual */}
        <div className="acreditar-group">
          <small>Acreditación Manual (Opcional)</small>
          <div className="manual-input-row">
            <input 
              type="number" 
              placeholder="Monto" 
              value={customMonto} 
              onChange={e => setCustomMonto(e.target.value)} 
              min="1"
            />
            <input 
              type="text" 
              placeholder="Motivo personalizado" 
              value={customMotivo} 
              onChange={e => setCustomMotivo(e.target.value)} 
            />
          </div>
        </div>

      </div>

      <div className="acreditar-footer">
        <div className="total-preview">
          <span>Total a Acreditar:</span>
          <strong>{total} Royales</strong>
        </div>
        <button 
          type="submit" 
          className="royal-button royal-button--gold" 
          disabled={total <= 0}
          style={{ opacity: total <= 0 ? 0.5 : 1, width: '100%' }}
        >
          Confirmar Operación
        </button>
      </div>
    </form>
  );
}
