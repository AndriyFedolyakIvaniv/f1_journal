function FavoritesStatsPage({ t, favorites, drivers, tracks, raceJournal, stats }) {
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
        <h2>{t('favorites')}</h2>
        <div className="favorites-grid">
          <article>
            <h3>{t('tabDrivers')}</h3>
            <ul className="stack-list">
              {favoriteDrivers.length ? (
                favoriteDrivers.map((item) => {
                  const driver = drivers.find((entry) => entry.id === item.referenceId)
                  return <li key={item.id}>{driver?.name ?? t('unknownDriver')}</li>
                })
              ) : (
                <li>{t('noFavoriteDrivers')}</li>
              )}
            </ul>
          </article>

          <article>
            <h3>{t('tabTracks')}</h3>
            <ul className="stack-list">
              {favoriteTracks.length ? (
                favoriteTracks.map((item) => {
                  const track = tracks.find((entry) => entry.id === item.referenceId)
                  return <li key={item.id}>{track?.name ?? t('unknownTrack')}</li>
                })
              ) : (
                <li>{t('noFavoriteTracks')}</li>
              )}
            </ul>
          </article>

          <article>
            <h3>{t('races')}</h3>
            <ul className="stack-list">
              {favoriteRaces.length ? (
                favoriteRaces.map((item) => {
                  const race = raceJournal.find((entry) => entry.id === item.referenceId)
                  return <li key={item.id}>{race?.grandPrix ?? t('unknownRace')}</li>
                })
              ) : (
                <li>{t('noFavoriteRaces')}</li>
              )}
            </ul>
          </article>
        </div>
      </section>

      <section className="metrics-grid">
        <article className="card metric-card">
          <p>{t('mostRatedDriver')}</p>
          <strong>{mostRatedDriver ? `${mostRatedDriver.name} (${stats.mostRatedDriverCount})` : stats.mostRatedDriverName || t('noData')}</strong>
        </article>
        <article className="card metric-card">
          <p>{t('highestRatedCircuit')}</p>
          <strong>{highestRatedTrack?.name ?? t('noData')}</strong>
        </article>
        <article className="card metric-card">
          <p>{t('averageRaceRating')}</p>
          <strong>{stats.averageRaceRating}</strong>
        </article>
        <article className="card metric-card">
          <p>{t('numberOfRacesLogged')}</p>
          <strong>{stats.racesLogged}</strong>
        </article>
        <article className="card metric-card">
          <p>{t('favoriteDriverFrequency')}</p>
          <strong>{stats.favoriteDriverFrequency}</strong>
        </article>
      </section>
    </section>
  )
}

export default FavoritesStatsPage
