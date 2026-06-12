export default function RoyalFrame({ children, className = '', tone = 'paper', style = {} }) {
  return <section className={`royal-frame royal-frame--${tone} ${className}`} style={style}>{children}</section>
}
