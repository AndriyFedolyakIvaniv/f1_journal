import { useMemo, useState } from 'react'
import DriverInteractiveCard from '../components/cards/DriverInteractiveCard'
import TrackInteractiveCard from '../components/cards/TrackInteractiveCard'
import { useJournal } from '../hooks/useJournal'

function JournalPage() {
  const { tracks, drivers, users, entries, activeUserId, setActiveUserId, addUser, addEntry } = useJournal()
  const [newUserName, setNewUserName] = useState('')
  const [form, setForm] = useState({
    trackId: tracks[0].id,
    driverId: drivers[0].id,
    session: 'Race',
    weather: '',
    tyre: '',
    bestLap: '',
    notes: '',
  })

  const selectedTrack = useMemo(
    () => tracks.find((track) => track.id === form.trackId) ?? tracks[0],
    [form.trackId, tracks]
  )

  const selectedDriver = useMemo(
    () => drivers.find((driver) => driver.id === form.driverId) ?? drivers[0],
    [drivers, form.driverId]
  )

  const handleInput = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateUser = (event) => {
    event.preventDefault()
    addUser(newUserName)
    setNewUserName('')
  }

  const handleCreateEntry = (event) => {
    event.preventDefault()
    addEntry(form)
    setForm((prev) => ({ ...prev, weather: '', tyre: '', bestLap: '', notes: '' }))
  }

  return (
    <section className="journal-page">
      <section className="journal-toolbar">
        <div>
          <label htmlFor="active-user">Active user</label>
          <select id="active-user" value={activeUserId ?? ''} onChange={(event) => setActiveUserId(event.target.value)}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <form className="new-user-form" onSubmit={handleCreateUser}>
          <label htmlFor="new-user">New user</label>
          <div>
            <input
              id="new-user"
              value={newUserName}
              onChange={(event) => setNewUserName(event.target.value)}
              placeholder="Create profile"
            />
            <button type="submit">Add</button>
          </div>
        </form>
      </section>

      <TrackInteractiveCard track={selectedTrack} />
      <DriverInteractiveCard driver={selectedDriver} />

      <section className="entry-panel">
        <h1>Season Journal Entry</h1>
        <form className="entry-form" onSubmit={handleCreateEntry}>
          <label>
            Track
            <select name="trackId" value={form.trackId} onChange={handleInput}>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Driver
            <select name="driverId" value={form.driverId} onChange={handleInput}>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Session
            <input name="session" value={form.session} onChange={handleInput} placeholder="FP2 / Qualy / Race" />
          </label>

          <label>
            Weather
            <input name="weather" value={form.weather} onChange={handleInput} placeholder="Windy, 28C" />
          </label>

          <label>
            Tyre
            <input name="tyre" value={form.tyre} onChange={handleInput} placeholder="C3 Used" />
          </label>

          <label>
            Best lap
            <input name="bestLap" value={form.bestLap} onChange={handleInput} placeholder="1:19.212" />
          </label>

          <label className="notes-field">
            Notes
            <textarea name="notes" value={form.notes} onChange={handleInput} rows={4} placeholder="Balance, degradation, strategy..." />
          </label>

          <button type="submit" className="save-button">
            Save entry
          </button>
        </form>
      </section>

      <section className="entry-history">
        <h2>My latest entries</h2>
        {entries.length === 0 ? (
          <p>No entries yet. Start by saving your first session note.</p>
        ) : (
          <ul>
            {entries.slice(0, 6).map((entry) => {
              const track = tracks.find((item) => item.id === entry.trackId)
              const driver = drivers.find((item) => item.id === entry.driverId)
              return (
                <li key={entry.id}>
                  <div>
                    <strong>{track?.name}</strong>
                    <span>{entry.session}</span>
                  </div>
                  <div>
                    <strong>{driver?.name}</strong>
                    <span>{entry.bestLap || 'No lap set'}</span>
                  </div>
                  <p>{entry.notes || 'No notes for this run.'}</p>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </section>
  )
}

export default JournalPage
