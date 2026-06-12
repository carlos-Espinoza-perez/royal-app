import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coins, Moon, Sun, ScrollText, Sparkles, TrendingUp, Medal, Flame } from 'lucide-react'
import RangoInsignia from '../components/RangoInsignia.jsx'
import BarraProgreso from '../components/BarraProgreso.jsx'
import HistorialItem from '../components/HistorialItem.jsx'
import PublicShell from '../layouts/PublicShell.jsx'
import { useTheme } from '../contexts/ThemeContext.jsx'
import {
  frasesMotivacionales,
  getNextRango,
  getRangoBySaldo,
} from '../data/mockData.js'
import { useSupabaseData } from '../contexts/SupabaseDataContext.jsx'
import { formatRoyales, getProgressToNextRank } from '../utils/formatters.js'

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 260, damping: 22 } }
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
}

export default function StudentPublicPage() {
  const { id } = useParams()
  const { theme, toggleTheme } = useTheme()
  const { alumnos, transacciones: allTransacciones, loading } = useSupabaseData()
  
  if (loading) {
    return (
      <PublicShell>
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh', color: 'var(--accent-500)' }}>
          <div className="lucide-spin"><Sun size={32} /></div>
        </div>
      </PublicShell>
    )
  }

  const alumno = alumnos.find(a => a.id === id)
  
  if (!alumno) {
    return (
      <PublicShell>
        <div style={{ textAlign: 'center', paddingTop: '4rem', color: 'white' }}>
          <h2>Expediente no encontrado</h2>
          <p>El código QR o enlace no es válido.</p>
        </div>
      </PublicShell>
    )
  }

  const rango = getRangoBySaldo(alumno.saldo)
  const siguienteRango = getNextRango(alumno.saldo)
  const progreso = getProgressToNextRank(alumno.saldo, rango, siguienteRango)
  const transacciones = allTransacciones.filter(t => t.alumnoId === alumno.id)
  
  // Calculate stats dynamically
  const totalAcreditado = transacciones.filter(t => t.tipo === 'acreditar').reduce((acc, t) => acc + t.monto, 0)
  const totalDescontado = transacciones.filter(t => t.tipo !== 'acreditar').reduce((acc, t) => acc + t.monto, 0)
  const rankingSorted = [...alumnos].sort((a, b) => b.saldo - a.saldo)
  const posicion = rankingSorted.findIndex(a => a.id === alumno.id) + 1
  
  const resumen = { totalAcreditado, totalDescontado, posicion }
  const frase = frasesMotivacionales[alumno.nombre.length % frasesMotivacionales.length]

  return (
    <PublicShell>
      {/* Fondo degradado del sistema */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse at 20% 0%, rgba(185,141,69,0.18), transparent 40%),
          radial-gradient(ellipse at 90% 80%, rgba(47,106,76,0.3), transparent 45%),
          linear-gradient(155deg, var(--primary-800) 0%, var(--primary-950) 60%, #081a10 100%)
        `
      }} />

      {/* Botón de tema - flotante arriba a la derecha */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed', top: '1rem', right: '1rem', zIndex: 50,
          width: '40px', height: '40px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#fff',
          cursor: 'pointer',
          display: 'grid', placeItems: 'center',
          transition: 'background 200ms, transform 200ms',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
        }}
        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <motion.div
        initial="hidden" animate="show" variants={stagger}
        style={{ position: 'relative', zIndex: 1, maxWidth: '480px', margin: '0 auto', padding: '0 0.5rem 3rem' }}
      >

        {/* HEADER — Nombre y rango */}
        <motion.div variants={fadeUp} style={{
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
          background: `
            radial-gradient(circle at 85% 10%, rgba(185,141,69,0.3), transparent 50%),
            linear-gradient(135deg, var(--primary-900), var(--primary-700))
          `,
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '1.75rem 1.5rem 1.5rem',
          color: '#fff'
        }}>
          {/* Crown icon */}
          <div style={{
            width: '44px', height: '44px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'grid', placeItems: 'center',
            color: 'var(--accent-100)',
            marginBottom: '1rem'
          }}>
            👑
          </div>

          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent-500)',
            display: 'block',
            marginBottom: '0.3rem',
            fontWeight: 700
          }}>Certificado personal</span>

          <h1 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(1.5rem, 7vw, 2.2rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            background: 'linear-gradient(135deg, #fff 40%, var(--accent-100))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.3rem'
          }}>{alumno.nombre}</h1>

          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 500,
            letterSpacing: '0.05em'
          }}>{alumno.numero}</p>

          {/* Bottom accent line */}
          <div style={{ marginTop: '1.25rem', height: '1px', background: 'rgba(255,255,255,0.12)' }} />
        </motion.div>

        {/* SALDO PRINCIPAL */}
        <motion.div variants={fadeUp} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderTop: 'none',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600
          }}>Saldo actual</span>
          <strong style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(2.8rem, 15vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--accent-100), var(--accent-500))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'block'
          }}>{formatRoyales(alumno.saldo)}</strong>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            display: 'block',
            marginTop: '0.25rem',
            fontWeight: 500
          }}>Royales disponibles</span>
        </motion.div>

        {/* RANGO Y PROGRESO */}
        <motion.div variants={fadeUp} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderTop: 'none',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '1.25rem 1.5rem'
        }}>
          <RangoInsignia rango={rango} />
          <div style={{ marginTop: '0.85rem' }}>
            <BarraProgreso progreso={progreso} siguienteRango={siguienteRango} />
          </div>
        </motion.div>

        {/* ESTADÍSTICAS GRID */}
        <motion.div variants={fadeUp} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderTop: 'none',
          overflow: 'hidden'
        }}>
          {[
            { icon: <TrendingUp size={16} />, label: 'Acreditado', value: formatRoyales(resumen.totalAcreditado), detail: 'Histórico' },
            { icon: <Coins size={16} />, label: 'Descontado', value: formatRoyales(resumen.totalDescontado), detail: 'Sanciones y canjes' },
            { icon: <Medal size={16} />, label: 'Ranking', value: `#${resumen.posicion}`, detail: 'En el grupo' },
            { icon: <Flame size={16} />, label: 'Racha', value: alumno.rachaDomingos, detail: 'Domingos' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(12px)',
              padding: '1.1rem 1.25rem',
              borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ color: 'var(--accent-500)', marginBottom: '0.4rem' }}>{stat.icon}</div>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.55rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                display: 'block',
                fontWeight: 600
              }}>{stat.label}</span>
              <strong style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(1.2rem, 7vw, 1.8rem)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.1,
                display: 'block'
              }}>{stat.value}</strong>
              <small style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.35)',
                fontWeight: 400
              }}>{stat.detail}</small>
            </div>
          ))}
        </motion.div>

        {/* HISTORIAL */}
        <motion.div variants={fadeUp} style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderTop: 'none',
          borderRadius: '0 0 20px 20px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '1.25rem 1.25rem 1.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(255,255,255,0.07)'
          }}>
            <ScrollText size={16} color="var(--accent-500)" />
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.8)'
            }}>Últimos movimientos</h2>
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {transacciones.map((transaccion) => (
              <HistorialItem key={transaccion.id} transaccion={transaccion} />
            ))}
          </div>
        </motion.div>

        {/* FOOTER */}
        <motion.div variants={fadeUp} style={{
          textAlign: 'center',
          padding: '1.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          color: 'rgba(255,255,255,0.25)'
        }}>
          <Sparkles size={14} />
          <em style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.8rem',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.35)',
            fontWeight: 300
          }}>{frase}</em>
          <Coins size={14} />
        </motion.div>

      </motion.div>
    </PublicShell>
  )
}

