import { useState } from 'react'
import { useF1Journal } from './hooks/useF1Journal'
import DriversPage from './pages/DriversPage'
import FavoritesStatsPage from './pages/FavoritesStatsPage'
import HomePage from './pages/HomePage'
import RaceJournalPage from './pages/RaceJournalPage'
import SeasonStatsPage from './pages/SeasonStatsPage'
import TracksPage from './pages/TracksPage'
import './App.css'

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'drivers', label: 'Drivers' },
  { id: 'tracks', label: 'Tracks' },
  { id: 'journal', label: 'Race Journal' },
  { id: 'favorites', label: 'Favorites & Stats' },
  { id: 'season', label: 'Season Stats' },
]

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [newUser, setNewUser] = useState('')
  const journal = useF1Journal()

  const handleCreateUser = (event) => {
    event.preventDefault()
    journal.addUser(newUser)
    setNewUser('')
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'drivers':
        return (
          <DriversPage
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
            tracks={journal.tracks}
            drivers={journal.drivers}
            raceJournal={journal.raceJournal}
            favoriteSet={journal.favoriteSet}
            addRaceEntry={journal.addRaceEntry}
            toggleFavorite={journal.toggleFavorite}
          />
        )
      case 'favorites':
        return (
          <FavoritesStatsPage
            favorites={journal.favorites}
            drivers={journal.drivers}
            tracks={journal.tracks}
            raceJournal={journal.raceJournal}
            stats={journal.stats}
          />
        )
      case 'season':
        return <SeasonStatsPage seasonStats={journal.seasonStats} tracks={journal.tracks} teams={journal.teams} />
      case 'home':
      default:
        return (
          <HomePage
            dashboard={journal.dashboard}
            drivers={journal.drivers}
            tracks={journal.tracks}
            raceJournal={journal.raceJournal}
            onNavigate={setActiveTab}
          />
        )
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header card">
        <div>
          <p className="app-kicker">Formula 1 Journal</p>
          <h1>My Motorsport Notebook</h1>
        </div>

        <div className="header-controls">
          <label>
            Active user
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

          <form onSubmit={handleCreateUser} className="add-user-form">
            <label>
              Add user
              <input
                value={newUser}
                onChange={(event) => setNewUser(event.target.value)}
                placeholder="New profile"
              />
            </label>
            <button type="submit" className="primary">
              Add
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
