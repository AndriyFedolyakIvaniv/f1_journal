import CircuitWeatherCard from '../components/CircuitWeatherCard'
import ferrari from '../assets/ferrari.png'

function HomePage({ t, dashboard, drivers, tracks, raceJournal, onNavigate, onLoadLatestRaceTemplate }) {
  const favoriteDriver = drivers.find((driver) => driver.id === dashboard.favoriteDriverId)
  const favoriteTrack = tracks.find((track) => track.id === dashboard.favoriteTrackId)
  const latest = dashboard.recentRace
  const highestRated = raceJournal.find((race) => race.id === dashboard.highestRatedRaceId)
  const recentTrack = tracks.find((track) => track.id === latest?.circuitId)

  return (
    <section className="screen-grid home-layout">
      <section className="card journal-cover">
        <div className="journal-cover-copy">
          <p className="eyebrow">{t('tabJournal')}</p>
          <h2>{latest?.grandPrix || t('homeHeroTitle')}</h2>
          <p className="cover-lead">
            {latest ? [latest.date, recentTrack?.name].filter(Boolean).join(' · ') : t('homeHeroSubtitle')}
          </p>
          <div className="chip-row">
            <button className="primary" type="button" onClick={() => onNavigate('journal')}>
              {t('quickJournal')} →
            </button>
            {latest && (
              <button type="button" onClick={onLoadLatestRaceTemplate}>{t('homeTemplateRace')}</button>
            )}
          </div>
        </div>
        <img className="journal-cover-car" src={ferrari} alt="" />
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
          <strong>{highestRated ? `${highestRated.grandPrix} (${highestRated.raceRating}/10)` : t('homeNoRaceRated')}</strong>
        </article>
      </section>

      <section className="screen-grid two-col">
        <section className="card">
          <h2>{t('homeRecentEntries')}</h2>
          <ul className="stack-list">
            <li><span>{t('homeLastRace')}</span><strong>{latest?.grandPrix ?? t('homeNoEntries')}</strong></li>
            <li>
              <span>{t('homeLastDriver')}</span>
              <strong>{drivers.find((driver) => driver.id === dashboard.recentDriverNote?.driverId)?.name ?? t('homeNoNotes')}</strong>
            </li>
            <li>
              <span>{t('homeLastTrack')}</span>
              <strong>{tracks.find((track) => track.id === dashboard.recentTrackNote?.trackId)?.name ?? t('homeNoNotes')}</strong>
            </li>
          </ul>
        </section>
        <CircuitWeatherCard t={t} track={recentTrack ?? favoriteTrack ?? tracks[0]} />
      </section>
    </section>
  )
}

export default HomePage
