export default function GuillocheBackground({ variant = 'light' }) {
  return (
    <div className={`guilloche guilloche--${variant}`} aria-hidden="true">
      <svg viewBox="0 0 600 360" preserveAspectRatio="none">
        <defs>
          <pattern id="royal-wave" width="120" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 40 C30 0 90 80 120 40 C150 0 210 80 240 40" />
            <path d="M0 20 C30 60 90 -20 120 20 C150 60 210 -20 240 20" />
          </pattern>
        </defs>
        <rect width="600" height="360" fill="url(#royal-wave)" />
      </svg>
    </div>
  )
}
