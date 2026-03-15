import { useMemo, useState } from 'react'
import './TrackInteractiveCard.css'

function TrackInteractiveCard({ track }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [activeSessionId, setActiveSessionId] = useState(track.sessions[0]?.id)

  const activeSession = useMemo(
    () => track.sessions.find((session) => session.id === activeSessionId) ?? track.sessions[0],
    [activeSessionId, track.sessions]
  )

  const cardStyle = useMemo(
    () => ({
      transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      '--glow-x': `${50 + tilt.y * 4}%`,
      '--glow-y': `${50 - tilt.x * 4}%`,
    }),
    [tilt]
  )

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateY = ((x / rect.width) * 2 - 1) * 10
    const rotateX = (1 - (y / rect.height) * 2) * 8

    setTilt({ x: rotateX, y: rotateY })
  }

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <article className="track-card-wrap">
      <div className="track-card" onMouseMove={handleMove} onMouseLeave={handleLeave} style={cardStyle}>
        <header className="track-card__header">
          <span className="track-card__tag">Track Card</span>
          <span className="track-card__status">{track.country}</span>
        </header>

        <h2 className="track-card__title">{track.name}</h2>
        <p className="track-card__subtitle">Interactive profile for pace, setup and race-weekend notes.</p>

        <div className="track-card__metrics">
          <div>
            <span className="metric-label">Length</span>
            <strong>{track.lengthKm.toFixed(3)} km</strong>
          </div>
          <div>
            <span className="metric-label">Corners</span>
            <strong>{track.corners}</strong>
          </div>
          <div>
            <span className="metric-label">Lap record</span>
            <strong>{track.lapRecord}</strong>
          </div>
        </div>

        <div className="track-card__sessions" role="tablist" aria-label="Select a track session">
          {track.sessions.map((session) => {
            const isActive = session.id === activeSession.id
            return (
              <button
                key={session.id}
                className={`session-chip ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveSessionId(session.id)}
                role="tab"
                aria-selected={isActive}
              >
                <span>{session.label}</span>
                <small>{session.temp}</small>
              </button>
            )
          })}
        </div>

        <footer className="track-card__footer">
          <p>
            Current grip: <strong>{activeSession.grip}</strong>
          </p>
          <button className="cta-button" type="button">
            Open Track Journal
          </button>
        </footer>
      </div>
    </article>
  )
}

export default TrackInteractiveCard
