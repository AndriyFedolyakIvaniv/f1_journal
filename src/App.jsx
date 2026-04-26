import { useEffect, useMemo, useState } from 'react'
import { useF1Journal } from './hooks/useF1Journal'
import { createTranslator, I18N_STORAGE_KEY } from './i18n'
import DriversPage from './pages/DriversPage'
import FavoritesStatsPage from './pages/FavoritesStatsPage'
import HomePage from './pages/HomePage'
import RaceJournalPage from './pages/RaceJournalPage'
import SeasonStatsPage from './pages/SeasonStatsPage'
import TracksPage from './pages/TracksPage'
import './App.css'

const buildRaceTemplate = (entry) => {
  if (!entry) return null

  const template = {
    grandPrix: entry.grandPrix ?? '',
    circuitId: entry.circuitId ?? '',
    date: entry.date ?? '',
    format: entry.format ?? 'standard',
    weather: entry.weather ?? 'dry',
    polePosition: entry.polePosition ?? '',
    fastestLap: entry.fastestLap ?? '',
    driverOfDay: entry.driverOfDay ?? '',
    dnfDrivers: entry.dnfDrivers ?? '',
    safetyCars: Number(entry.safetyCars) || 0,
    redFlags: Number(entry.redFlags) || 0,
    raceRating: Number(entry.raceRating) || 7,
    sprintRating: Number(entry.sprintRating) || 5,
    bestOvertake: entry.bestOvertake ?? '',
    surprise: entry.surprise ?? '',
    disappointment: entry.disappointment ?? '',
    notes: entry.notes ?? '',
    sprintPoleSitter: entry.sprintPoleSitter ?? '',
  }

  for (let position = 1; position <= 22; position += 1) {
    template[`p${position}Driver`] = entry[`p${position}Driver`] ?? ''
  }

  for (let position = 1; position <= 8; position += 1) {
    template[`sprintP${position}Driver`] = entry[`sprintP${position}Driver`] ?? ''
  }

  return template
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [newUser, setNewUser] = useState('')
  const [raceTemplateSeed, setRaceTemplateSeed] = useState(null)
  const [language, setLanguage] = useState(() => window.localStorage.getItem(I18N_STORAGE_KEY) ?? 'en')
  const journal = useF1Journal()
  const t = useMemo(() => createTranslator(language), [language])

  const tabs = useMemo(
    () => [
      { id: 'home', label: `🏠 ${t('tabHome')}` },
      { id: 'drivers', label: `👤 ${t('tabDrivers')}` },
      { id: 'tracks', label: `🏁 ${t('tabTracks')}` },
      { id: 'journal', label: `📋 ${t('tabJournal')}` },
      { id: 'favorites', label: `⭐ ${t('tabFavorites')}` },
      { id: 'season', label: `🏆 ${t('tabSeason')}` },
    ],
    [t]
  )

  useEffect(() => {
    window.localStorage.setItem(I18N_STORAGE_KEY, language)
  }, [language])

  const handleCreateUser = (event) => {
    event.preventDefault()
    journal.addUser(newUser)
    setNewUser('')
  }

  const handleLoadLatestRaceTemplate = () => {
    const latestRace = journal.raceJournal[0]

    if (!latestRace) {
      setRaceTemplateSeed(null)
      setActiveTab('journal')
      return
    }

    setRaceTemplateSeed(buildRaceTemplate(latestRace))
    setActiveTab('journal')
  }

  const handleConsumeRaceTemplate = () => {
    setRaceTemplateSeed(null)
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'drivers':
        return (
          <DriversPage
            t={t}
            drivers={journal.drivers}
            driverJournal={journal.driverJournal}
            favoriteSet={journal.favoriteSet}
            upsertDriverJournal={journal.upsertDriverJournal}
            toggleFavorite={journal.toggleFavorite}
          />
        )
      case 'tracks':
        return (
          <TracksPage
            t={t}
            tracks={journal.tracks}
            trackJournal={journal.trackJournal}
            favoriteSet={journal.favoriteSet}
            upsertTrackJournal={journal.upsertTrackJournal}
            toggleFavorite={journal.toggleFavorite}
          />
        )
      case 'journal':
        return (
          <RaceJournalPage
            t={t}
            tracks={journal.tracks}
            drivers={journal.drivers}
            raceJournal={journal.raceJournal}
            favoriteSet={journal.favoriteSet}
            addRaceEntry={journal.addRaceEntry}
            toggleFavorite={journal.toggleFavorite}
            raceTemplateSeed={raceTemplateSeed}
            onLoadLatestRaceTemplate={handleLoadLatestRaceTemplate}
            onConsumeRaceTemplate={handleConsumeRaceTemplate}
          />
        )
      case 'favorites':
        return (
          <FavoritesStatsPage
            t={t}
            favorites={journal.favorites}
            drivers={journal.drivers}
            tracks={journal.tracks}
            raceJournal={journal.raceJournal}
            stats={journal.stats}
          />
        )
      case 'season':
        return <SeasonStatsPage t={t} seasonStats={journal.seasonStats} tracks={journal.tracks} teams={journal.teams} />
      case 'home':
      default:
        return (
          <HomePage
            t={t}
            dashboard={journal.dashboard}
            drivers={journal.drivers}
            tracks={journal.tracks}
            raceJournal={journal.raceJournal}
            onNavigate={setActiveTab}
            onLoadLatestRaceTemplate={handleLoadLatestRaceTemplate}
          />
        )
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header card">
        <div>
          <p className="app-kicker">{t('appKicker')}</p>
          <h1>{t('appTitle')}</h1>
        </div>

        <div className="header-controls">
          <label>
            {t('activeUser')}
            <select
              value={journal.activeUserId ?? ''}
              onChange={(event) => journal.setActiveUserId(event.target.value)}
            >
              {journal.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t('language')}
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="en">{t('langEnglish')}</option>
              <option value="es">{t('langSpanish')}</option>
            </select>
          </label>

          <form onSubmit={handleCreateUser} className="add-user-form">
            <label>
              {t('addUser')}
              <input
                value={newUser}
                onChange={(event) => setNewUser(event.target.value)}
                placeholder={t('newProfile')}
              />
            </label>
            <button type="submit" className="primary">
              {t('add')}
            </button>
          </form>
        </div>
      </header>

      <nav className="app-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === activeTab ? 'is-active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {renderScreen()}
    </main>
  )
}

export default App
