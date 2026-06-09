export default function RoyalFrame({ children, className = '', tone = 'paper' }) {
  return <section className={`royal-frame royal-frame--${tone} ${className}`}>{children}</section>
}
