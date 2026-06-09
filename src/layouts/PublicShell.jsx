import GuillocheBackground from '../components/GuillocheBackground.jsx'

export default function PublicShell({ children }) {
  return (
    <main className="public-shell">
      <GuillocheBackground />
      {children}
    </main>
  )
}
