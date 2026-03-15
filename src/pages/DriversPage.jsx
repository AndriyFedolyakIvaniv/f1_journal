import { useEffect, useMemo, useState } from 'react'
import { DRIVER_IMAGES } from '../constants/driverImages'

const emptyForm = {
  rating: 0,
  bestRacePerformance: '',
  drivingStyleNotes: '',
  seasonPerformanceNotes: '',
  personalComments: '',
}

const TEAM_THEME = {
  mclaren: { from: '#7a3f00', to: '#ff8b16' },
  mercedes: { from: '#0f7169', to: '#1ec8b7' },
  'red-bull': { from: '#173057', to: '#4a8fff' },
  ferrari: { from: '#8b001f', to: '#ff264e' },
  williams: { from: '#003f9f', to: '#4a8bff' },
  'racing-bulls': { from: '#0038b8', to: '#2f72ff' },
  'aston-martin': { from: '#036f5f', to: '#23c6a3' },
  haas: { from: '#5e6873', to: '#a4acb4' },
  alpine: { from: '#0f2f8c', to: '#3f60de' },
  audi: { from: '#5b0018', to: '#a01338' },
  cadillac: { from: '#1f2440', to: '#3d4a78' },
}

const FLAG_BY_NATIONALITY = {
  Argentina: 'AR',
  Australia: 'AU',
  Brazil: 'BR',
  Canada: 'CA',
  Finland: 'FI',
  France: 'FR',
  Germany: 'DE',
  Italy: 'IT',
  Mexico: 'MX',
  Monaco: 'MC',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Spain: 'ES',
  Thailand: 'TH',
  'United Kingdom': 'GB',
}

const toFlagEmoji = (code) => {
  if (!code) return '🏁'
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

const splitDisplayName = (name) => {
  const parts = String(name ?? '').trim().split(' ')
  return {
    first: parts[0] ?? '',
    rest: parts.slice(1).join(' '),
  }
}

const compactTeamName = (team) => {
  if (!team) return 'Independent'
  return team
    .replace('Mercedes-AMG Petronas Formula One Team', 'Mercedes')
    .replace('Scuderia Ferrari', 'Ferrari')
    .replace('Racing Bulls F1 Team', 'Racing Bulls')
    .replace('Aston Martin F1 Team', 'Aston Martin')
    .replace('Haas F1 Team', 'Haas')
    .replace('Alpine F1 Team', 'Alpine')
    .replace('Audi F1 Team', 'Audi')
    .replace('Cadillac Formula 1 Team', 'Cadillac')
}

function DriversPage({ t, drivers, driverJournal, favoriteSet, upsertDriverJournal, toggleFavorite }) {
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.id ?? '')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const selectedDriver = useMemo(
    () => drivers.find((item) => item.id === selectedDriverId) ?? drivers[0],
    [drivers, selectedDriverId]
  )

  const selectedNote = useMemo(
    () => driverJournal.find((item) => item.driverId === selectedDriver?.id) ?? emptyForm,
    [driverJournal, selectedDriver?.id]
  )

  const [form, setForm] = useState(selectedNote)

  useEffect(() => {
    setForm(selectedNote)
  }, [selectedNote])

  useEffect(() => {
    if (!isModalOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  const handleSelect = (driverId) => {
    setSelectedDriverId(driverId)
    const note = driverJournal.find((item) => item.driverId === driverId) ?? emptyForm
    setForm(note)
    setIsModalOpen(true)
  }

  const handleInput = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    upsertDriverJournal({ ...form, driverId: selectedDriver.id })
    setIsModalOpen(false)
  }

  return (
    <section className="screen-grid">
      <section className="card">
        <h2>{t('driversGrid')}</h2>
        <ul className="driver-showcase-grid">
          {drivers.map((driver) => {
            const note = driverJournal.find((item) => item.driverId === driver.id)
            const theme = TEAM_THEME[driver.teamId] ?? { from: '#2a2a2a', to: '#555' }
            const flag = toFlagEmoji(FLAG_BY_NATIONALITY[driver.nationality])
            const name = splitDisplayName(driver.name)
            return (
              <li key={driver.id} className={driver.id === selectedDriver.id ? 'is-active' : ''}>
                <button
                  type="button"
                  className="driver-showcase-card"
                  style={{ '--team-from': theme.from, '--team-to': theme.to }}
                  onClick={() => handleSelect(driver.id)}
                >
                  <div className="driver-showcase-content">
                    <div className="driver-showcase-header">
                      <h3>
                        <span>{name.first}</span>
                        <span>{name.rest}</span>
                      </h3>
                      <small>{note?.rating ? `${'★'.repeat(note.rating)}` : ''}</small>
                    </div>
                    <p>{compactTeamName(driver.team)}</p>
                    <strong>{driver.number}</strong>
                    <span className="driver-flag">{flag}</span>
                  </div>
                  {DRIVER_IMAGES[driver.id] && (
                    <img src={DRIVER_IMAGES[driver.id]} alt={driver.name} className="driver-showcase-image" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {isModalOpen && (
        <section className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-panel card" onClick={(event) => event.stopPropagation()}>
            <div className="card-headline">
              <h2>{selectedDriver.name}</h2>
              <div className="modal-actions">
                <button
                  type="button"
                  className="fav-btn"
                  onClick={() => toggleFavorite('driver', selectedDriver.id)}
                  title={favoriteSet.has(`driver:${selectedDriver.id}`) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favoriteSet.has(`driver:${selectedDriver.id}`) ? '★' : '☆'}
                </button>
                <button type="button" className="ghost" onClick={() => setIsModalOpen(false)}>
                  {t('close')}
                </button>
              </div>
            </div>

            <form className="editor-form driver-modal-form" onSubmit={handleSave}>
              <label>
                {t('team')}
                <input value={selectedDriver.team} readOnly />
              </label>

              <label>
                {t('personalRating')}
                <input name="rating" type="number" min="0" max="5" value={form.rating} onChange={handleInput} />
              </label>

              <label>
                {t('bestRaceSeen')}
                <input name="bestRacePerformance" value={form.bestRacePerformance} onChange={handleInput} />
              </label>

              <label>
                {t('drivingStyleNotes')}
                <textarea name="drivingStyleNotes" rows={3} value={form.drivingStyleNotes} onChange={handleInput} />
              </label>

              <label>
                {t('seasonPerformanceNotes')}
                <textarea
                  name="seasonPerformanceNotes"
                  rows={3}
                  value={form.seasonPerformanceNotes}
                  onChange={handleInput}
                />
              </label>

              <label>
                {t('personalComments')}
                <textarea name="personalComments" rows={3} value={form.personalComments} onChange={handleInput} />
              </label>

              <button type="submit" className="primary">
                {t('saveDriverNotes')}
              </button>
            </form>
          </div>
        </section>
      )}
    </section>
  )
}

export default DriversPage
