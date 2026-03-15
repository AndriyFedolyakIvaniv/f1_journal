function HomePage({ dashboard, drivers, tracks, raceJournal, onNavigate }) {
  const favoriteDriver = drivers.find((item) => item.id === dashboard.favoriteDriverId)
  const favoriteTrack = tracks.find((item) => item.id === dashboard.favoriteTrackId)
  const highestRace = raceJournal.find((item) => item.id === dashboard.highestRatedRaceId)

  return (
    <section className="screen-grid">
      <section className="card quick-actions">
        <h2>Quick Access</h2>
        <div className="chip-row">
          <button type="button" onClick={() => onNavigate('drivers')}>
            👤 Drivers
          </button>
          <button type="button" onClick={() => onNavigate('tracks')}>
            🏁 Tracks
          </button>
          <button type="button" onClick={() => onNavigate('journal')}>
            📋 Race Journal
          </button>
          <button type="button" onClick={() => onNavigate('season')}>
            🏆 Season Stats
          </button>
        </div>
      </section>

      <section className="metrics-grid">
        <article className="card metric-card">
          <p>Total races logged</p>
          <strong>{dashboard.racesLogged}</strong>
        </article>
        <article className="card metric-card">
          <p>Favorite driver</p>
          <strong>{favoriteDriver?.name ?? 'No favorite yet'}</strong>
        </article>
        <article className="card metric-card">
          <p>Favorite circuit</p>
          <strong>{favoriteTrack?.name ?? 'No favorite yet'}</strong>
        </article>
        <article className="card metric-card">
          <p>Highest rated race</p>
          <strong>{highestRace ? `${highestRace.grandPrix} (${highestRace.raceRating}/10)` : 'No race rated'}</strong>
        </article>
      </section>

      <section className="card">
        <h2>Recent entries</h2>
        <ul className="stack-list">
          <li>
            <span>Last race entry</span>
            <strong>{dashboard.recentRace?.grandPrix ?? 'No entries yet'}</strong>
          </li>
          <li>
            <span>Last edited driver</span>
            <strong>{drivers.find((item) => item.id === dashboard.recentDriverNote?.driverId)?.name ?? 'No notes yet'}</strong>
          </li>
          <li>
            <span>Last edited track</span>
            <strong>{tracks.find((item) => item.id === dashboard.recentTrackNote?.trackId)?.name ?? 'No notes yet'}</strong>
          </li>
        </ul>
      </section>
    </section>
  )
}

export default HomePage
