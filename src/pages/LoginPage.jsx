import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, KeyRound, Mail, Shield } from 'lucide-react'
import GuillocheBackground from '../components/GuillocheBackground.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('maestro@royaltreasury.app')

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/admin')
  }

  return (
    <main className="login-page">
      <GuillocheBackground variant="dark" />
      <section className="login-hero">
        <div className="crest">
          <Crown size={28} />
          <Shield size={44} />
        </div>
        <span className="eyebrow">Acceso reservado</span>
        <h1>Royal Treasury</h1>
        <p>Administracion oficial de royales, rangos y carnets del grupo de adolescentes.</p>
      </section>

      <RoyalFrame className="login-card" tone="dark">
        <form onSubmit={handleSubmit}>
          <div className="form-heading">
            <span>Maestro administrador</span>
            <h2>Entrar al tesoro</h2>
          </div>
          <label>
            Correo
            <span className="input-shell">
              <Mail size={18} />
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
            </span>
          </label>
          <label>
            Contrasena
            <span className="input-shell">
              <KeyRound size={18} />
              <input defaultValue="royales-demo" type="password" />
            </span>
          </label>
          <button className="royal-button royal-button--gold" type="submit">
            Ingresar
          </button>
          <small>Ingreso simulado para esta primera version con datos mock.</small>
        </form>
      </RoyalFrame>
    </main>
  )
}
