import CircuitWeatherCard from '../components/CircuitWeatherCard'

function HomePage({ t, dashboard, drivers, tracks, raceJournal, onNavigate, onLoadLatestRaceTemplate }) {
  const favoriteDriver = drivers.find((item) => item.id === dashboard.favoriteDriverId)
  const favoriteTrack = tracks.find((item) => item.id === dashboard.favoriteTrackId)
  const highestRace = raceJournal.find((item) => item.id === dashboard.highestRatedRaceId)
  const recentRaceTrack = tracks.find((item) => item.id === dashboard.recentRace?.circuitId)
  const weatherTrack = favoriteTrack ?? recentRaceTrack ?? tracks[0]

  return (
    <section className="screen-grid home-layout">
      <section className="home-hero card">
        <div className="home-hero__copy">
          <p className="eyebrow">{t('homeHeroKicker')}</p>
          <h2>{t('homeHeroTitle')}</h2>
          <p className="home-hero__lead">{t('homeHeroSubtitle')}</p>

          <div className="home-hero__stats">
            <article>
              <span>{t('homeTotalRaces')}</span>
              <strong>{dashboard.racesLogged}</strong>
            </article>
            <article>
              <span>{t('homeFavoriteDriver')}</span>
              <strong>{favoriteDriver?.name ?? t('homeNoFavorite')}</strong>
            </article>
            <article>
              <span>{t('homeFavoriteTrack')}</span>
              <strong>{favoriteTrack?.name ?? t('homeNoFavorite')}</strong>
            </article>
          </div>

          <div className="chip-row hero-actions">
            <button type="button" className="primary" onClick={() => onNavigate('journal')}>
              {t('quickJournal')}
            </button>
            <button type="button" onClick={() => onNavigate('season')}>
              {t('quickSeason')}
            </button>
            <button type="button" onClick={onLoadLatestRaceTemplate} disabled={!raceJournal.length}>
              {t('homeTemplateRace')}
            </button>
          </div>
        </div>

        <CircuitWeatherCard t={t} track={weatherTrack} />
      </section>

      <section className="metrics-grid dashboard-metrics">
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

      <section className="screen-grid two-col home-detail-grid">
        <section className="card quick-actions">
          <h2>{t('homeQuickAccess')}</h2>
          <div className="chip-row home-quick-row">
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

          <p className="home-note">{t('homeTemplateHint')}</p>
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
    </section>
  )
}

export default HomePage
