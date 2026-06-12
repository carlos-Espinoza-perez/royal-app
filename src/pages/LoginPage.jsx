import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, KeyRound, Mail, Shield, AlertTriangle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focused, setFocused] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/admin')
  }, [user, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="login-page">

      {/* Decorative top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, transparent, var(--accent-500), transparent)'
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '2rem', padding: '1.5rem 1rem',
        maxWidth: '420px', margin: '0 auto',
        animation: 'slideUp 500ms cubic-bezier(0.16,1,0.3,1) both'
      }}>

        {/* Crest */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem'
        }}>
          <div style={{
            width: '80px', height: '80px',
            display: 'grid', placeItems: 'center',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 0 40px rgba(185,141,69,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            color: 'var(--accent-100)',
            position: 'relative'
          }}>
            <Shield size={40} strokeWidth={1.5} />
            <Crown size={20} style={{ position: 'absolute', top: '-10px', color: 'var(--accent-500)' }} />
          </div>

          <div style={{ textAlign: 'center', color: '#fff' }}>
            <span style={{
              display: 'block',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-500)',
              marginBottom: '0.4rem'
            }}>
              Acceso reservado
            </span>
            <h1 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(1.8rem, 8vw, 2.6rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '0.04em',
              background: 'linear-gradient(135deg, #fff 40%, var(--accent-100))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Royal Treasury</h1>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.65)',
              marginTop: '0.5rem',
              lineHeight: 1.5
            }}>
              Administración oficial de Royales, rangos y carnets
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '20px',
          padding: '1.75rem 1.5rem',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent-500)',
              display: 'block',
              marginBottom: '0.25rem'
            }}>Maestro administrador</span>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.03em'
            }}>Entrar al Tesoro</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#fca5a5',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: "'Poppins', sans-serif"
              }}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Email field */}
            <label style={{ display: 'grid', gap: '0.4rem' }}>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600
              }}>Correo</span>
              <span style={{
                minHeight: '48px',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                border: `1px solid ${focused === 'email' ? 'var(--accent-500)' : 'rgba(255,255,255,0.18)'}`,
                borderRadius: '12px',
                padding: '0 1rem',
                background: 'rgba(255,255,255,0.07)',
                transition: 'border-color 200ms, box-shadow 200ms',
                boxShadow: focused === 'email' ? '0 0 0 3px rgba(185,141,69,0.2)' : 'none'
              }}>
                <Mail size={16} color={focused === 'email' ? 'var(--accent-500)' : 'rgba(255,255,255,0.4)'} style={{ flexShrink: 0, transition: 'color 200ms' }} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  type="email"
                  placeholder="admin@correo.com"
                  style={{
                    width: '100%', border: 0, outline: 0,
                    background: 'transparent', color: '#fff',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '1rem'
                  }}
                />
              </span>
            </label>

            {/* Password field */}
            <label style={{ display: 'grid', gap: '0.4rem' }}>
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600
              }}>Contraseña</span>
              <span style={{
                minHeight: '48px',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                border: `1px solid ${focused === 'pass' ? 'var(--accent-500)' : 'rgba(255,255,255,0.18)'}`,
                borderRadius: '12px',
                padding: '0 1rem',
                background: 'rgba(255,255,255,0.07)',
                transition: 'border-color 200ms, box-shadow 200ms',
                boxShadow: focused === 'pass' ? '0 0 0 3px rgba(185,141,69,0.2)' : 'none'
              }}>
                <KeyRound size={16} color={focused === 'pass' ? 'var(--accent-500)' : 'rgba(255,255,255,0.4)'} style={{ flexShrink: 0, transition: 'color 200ms' }} />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused('')}
                  type="password"
                  placeholder="••••••••"
                  style={{
                    width: '100%', border: 0, outline: 0,
                    background: 'transparent', color: '#fff',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '1rem'
                  }}
                />
              </span>
            </label>

            {/* Submit */}
            <button
              className="royal-button royal-button--gold"
              type="submit"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.5rem',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                minHeight: '52px'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar al Tesoro'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              color: 'rgba(255,255,255,0.3)'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <small style={{
                fontFamily: "'Poppins', sans-serif",
                fontStyle: 'italic',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.4)'
              }}>
                Solo personal autorizado
              </small>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

          </form>
        </div>

        {/* Footer stamp */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center'
        }}>
          Honra · Fe · Servicio · Generosidad
        </p>

      </div>
    </main>
  )
}

