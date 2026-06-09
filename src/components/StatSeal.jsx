export default function StatSeal({ label, value, detail }) {
  return (
    <article className="stat-seal">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </article>
  )
}
