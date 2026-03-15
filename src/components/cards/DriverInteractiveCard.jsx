import './DriverInteractiveCard.css'

function DriverInteractiveCard({ driver }) {
  return (
    <article className="driver-card">
      <p className="driver-card__label">Driver Card</p>
      <h3 className="driver-card__name">{driver.name}</h3>
      <p className="driver-card__team">{driver.team}</p>

      <div className="driver-card__meta">
        <div>
          <span>Number</span>
          <strong>#{driver.number}</strong>
        </div>
        <div>
          <span>Nationality</span>
          <strong>{driver.nationality}</strong>
        </div>
      </div>
    </article>
  )
}

export default DriverInteractiveCard
