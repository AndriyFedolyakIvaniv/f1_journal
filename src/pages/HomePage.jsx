function HomePage({ t, dashboard, drivers, tracks, raceJournal, onNavigate }) {
  const favoriteDriver = drivers.find((item) => item.id === dashboard.favoriteDriverId)
  const favoriteTrack = tracks.find((item) => item.id === dashboard.favoriteTrackId)
  const highestRace = raceJournal.find((item) => item.id === dashboard.highestRatedRaceId)

  return (
    <section className="screen-grid">
      <section className="card quick-actions">
        <h2>{t('homeQuickAccess')}</h2>
        <div className="chip-row">
          <button type="button" onClick={() => onNavigate('drivers')}>
            👤 {t('quickDrivers')}
          </button>
          <button type="button" onClick={() => onNavigate('tracks')}>
            🏁 {t('quickTracks')}
          </button>
          <button type="button" onClick={() => onNavigate('journal')}>
            📋 {t('quickJournal')}
          </button>
          <button type="button" onClick={() => onNavigate('season')}>
            🏆 {t('quickSeason')}
          </button>
        </div>
      </section>

      <section className="metrics-grid">
        <article className="card metric-card">
          <p>{t('homeTotalRaces')}</p>
          <strong>{dashboard.racesLogged}</strong>
        </article>
        <article className="card metric-card">
          <p>{t('homeFavoriteDriver')}</p>
          <strong>{favoriteDriver?.name ?? t('homeNoFavorite')}</strong>
        </article>
        <article className="card metric-card">
          <p>{t('homeFavoriteTrack')}</p>
          <strong>{favoriteTrack?.name ?? t('homeNoFavorite')}</strong>
        </article>
        <article className="card metric-card">
          <p>{t('homeHighestRace')}</p>
          <strong>{highestRace ? `${highestRace.grandPrix} (${highestRace.raceRating}/10)` : t('homeNoRaceRated')}</strong>
        </article>
      </section>

      <section className="card">
        <h2>{t('homeRecentEntries')}</h2>
        <ul className="stack-list">
          <li>
            <span>{t('homeLastRace')}</span>
            <strong>{dashboard.recentRace?.grandPrix ?? t('homeNoEntries')}</strong>
          </li>
          <li>
            <span>{t('homeLastDriver')}</span>
            <strong>{drivers.find((item) => item.id === dashboard.recentDriverNote?.driverId)?.name ?? t('homeNoNotes')}</strong>
          </li>
          <li>
            <span>{t('homeLastTrack')}</span>
            <strong>{tracks.find((item) => item.id === dashboard.recentTrackNote?.trackId)?.name ?? t('homeNoNotes')}</strong>
          </li>
        </ul>
      </section>
    </section>
  )
}

export default HomePage
