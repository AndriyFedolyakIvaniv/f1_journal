function FavoritesStatsPage({ favorites, drivers, tracks, raceJournal, stats }) {
  const favoriteDrivers = favorites.filter((item) => item.type === 'driver')
  const favoriteTracks = favorites.filter((item) => item.type === 'track')
  const favoriteRaces = favorites.filter((item) => item.type === 'race')

  const mostRatedDriver = drivers.find(
    (item) => item.name.toLowerCase() === (stats.mostRatedDriverName ?? '').toLowerCase()
  )
  const highestRatedTrack = tracks.find((item) => item.id === stats.highestRatedCircuitId)

  return (
    <section className="screen-grid">
      <section className="card">
        <h2>Favorites</h2>
        <div className="favorites-grid">
          <article>
            <h3>Drivers</h3>
            <ul className="stack-list">
              {favoriteDrivers.length ? (
                favoriteDrivers.map((item) => {
                  const driver = drivers.find((entry) => entry.id === item.referenceId)
                  return <li key={item.id}>{driver?.name ?? 'Unknown driver'}</li>
                })
              ) : (
                <li>No favorite drivers yet.</li>
              )}
            </ul>
          </article>

          <article>
            <h3>Tracks</h3>
            <ul className="stack-list">
              {favoriteTracks.length ? (
                favoriteTracks.map((item) => {
                  const track = tracks.find((entry) => entry.id === item.referenceId)
                  return <li key={item.id}>{track?.name ?? 'Unknown track'}</li>
                })
              ) : (
                <li>No favorite tracks yet.</li>
              )}
            </ul>
          </article>

          <article>
            <h3>Races</h3>
            <ul className="stack-list">
              {favoriteRaces.length ? (
                favoriteRaces.map((item) => {
                  const race = raceJournal.find((entry) => entry.id === item.referenceId)
                  return <li key={item.id}>{race?.grandPrix ?? 'Unknown race'}</li>
                })
              ) : (
                <li>No favorite races yet.</li>
              )}
            </ul>
          </article>
        </div>
      </section>

      <section className="metrics-grid">
        <article className="card metric-card">
          <p>Most rated driver</p>
          <strong>{mostRatedDriver ? `${mostRatedDriver.name} (${stats.mostRatedDriverCount})` : stats.mostRatedDriverName || 'No data'}</strong>
        </article>
        <article className="card metric-card">
          <p>Highest rated circuit</p>
          <strong>{highestRatedTrack?.name ?? 'No data'}</strong>
        </article>
        <article className="card metric-card">
          <p>Average race rating</p>
          <strong>{stats.averageRaceRating}</strong>
        </article>
        <article className="card metric-card">
          <p>Number of races logged</p>
          <strong>{stats.racesLogged}</strong>
        </article>
        <article className="card metric-card">
          <p>Favorite driver frequency</p>
          <strong>{stats.favoriteDriverFrequency}</strong>
        </article>
      </section>
    </section>
  )
}

export default FavoritesStatsPage
