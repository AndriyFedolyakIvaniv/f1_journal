import { useState } from 'react'

const WEATHER_ICON = { dry: '☀️', rain: '🌧️', mixed: '🌦️' }

const FORMAT_LABEL = {
  standard: '🏁 Race',
  sprint: '⚡ Sprint',
  experimental: '🧪 Exp',
}

const RACE_POS_BADGE = (pos) => (pos === 1 ? 'gold' : pos === 2 ? 'silver' : pos === 3 ? 'bronze' : '')

const initialForm = (tracks) => ({
  grandPrix: '',
  circuitId: tracks[0]?.id ?? '',
  date: '',
  format: 'standard',
  weather: 'dry',
  polePosition: '',
  fastestLap: '',
  driverOfDay: '',
  p1Driver: '',
  p2Driver: '',
  p3Driver: '',
  p4Driver: '',
  p5Driver: '',
  p6Driver: '',
  p7Driver: '',
  p8Driver: '',
  p9Driver: '',
  p10Driver: '',
  p11Driver: '',
  p12Driver: '',
  sprintPoleSitter: '',
  sprintP1Driver: '',
  sprintP2Driver: '',
  sprintP3Driver: '',
  sprintP4Driver: '',
  sprintP5Driver: '',
  sprintP6Driver: '',
  sprintP7Driver: '',
  sprintP8Driver: '',
  dnfDrivers: '',
  safetyCars: 0,
  redFlags: 0,
  raceRating: 7,
  sprintRating: 5,
  bestOvertake: '',
  surprise: '',
  disappointment: '',
  notes: '',
})

function DriverSelect({ name, value, onChange, driverNames, prefix, required }) {
  return (
    <select name={name} value={value} onChange={onChange} required={required}>
      <option value="">— driver —</option>
      {driverNames.map((n) => (
        <option key={`${prefix}-${n}`} value={n}>
          {n}
        </option>
      ))}
    </select>
  )
}

function RaceJournalPage({ tracks, drivers, raceJournal, favoriteSet, addRaceEntry, toggleFavorite }) {
  const [form, setForm] = useState(initialForm(tracks))

  const driverNames = drivers.map((driver) => driver.name)
  const isSprint = form.format === 'sprint' || form.format === 'experimental'

  const handleInput = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addRaceEntry(form)
    setForm(initialForm(tracks))
  }

  return (
    <section className="screen-grid">
      <section className="card">
        <h2>Race Diary Entry</h2>
        <form className="race-form" onSubmit={handleSubmit}>

          {/* ── GP Info ── */}
          <label>
            Grand Prix name
            <input name="grandPrix" value={form.grandPrix} onChange={handleInput} required />
          </label>

          <label>
            Circuit
            <select name="circuitId" value={form.circuitId} onChange={handleInput}>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input type="date" name="date" value={form.date} onChange={handleInput} />
          </label>

          <label>
            Weekend format
            <select name="format" value={form.format} onChange={handleInput}>
              <option value="standard">🏁 Standard</option>
              <option value="sprint">⚡ Sprint</option>
              <option value="experimental">🧪 Experimental</option>
            </select>
          </label>

          <label>
            Weather
            <select name="weather" value={form.weather} onChange={handleInput}>
              <option value="dry">☀️ Dry</option>
              <option value="rain">🌧️ Rain</option>
              <option value="mixed">🌦️ Mixed</option>
            </select>
          </label>

          {/* ── Key Awards ── */}
          <div className="full-row">
            <h3 className="section-heading">Key Awards</h3>
            <div className="awards-row">
              <label>
                Pole position
                <DriverSelect name="polePosition" value={form.polePosition} onChange={handleInput} driverNames={driverNames} prefix="pole" />
              </label>
              <label>
                Fastest lap
                <DriverSelect name="fastestLap" value={form.fastestLap} onChange={handleInput} driverNames={driverNames} prefix="fl" />
              </label>
              <label>
                Driver of the day
                <DriverSelect name="driverOfDay" value={form.driverOfDay} onChange={handleInput} driverNames={driverNames} prefix="dotd" />
              </label>
            </div>
          </div>

          {/* ── Race Classification ── */}
          <div className="full-row">
            <h3 className="section-heading">Race Classification</h3>
            <div className="positions-grid">
              {[...Array(12)].map((_, i) => {
                const pos = i + 1
                const field = `p${pos}Driver`
                return (
                  <div key={pos} className="pos-row">
                    <span className={`pos-badge ${RACE_POS_BADGE(pos)}`}>P{pos}</span>
                    <DriverSelect
                      name={field}
                      value={form[field]}
                      onChange={handleInput}
                      driverNames={driverNames}
                      prefix={`p${pos}`}
                      required={pos === 1}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Sprint Results (conditional) ── */}
          {isSprint && (
            <div className="full-row">
              <h3 className="section-heading">Sprint Race Results</h3>
              <div className="awards-row" style={{ marginBottom: '10px' }}>
                <label>
                  Sprint Shootout pole
                  <DriverSelect name="sprintPoleSitter" value={form.sprintPoleSitter} onChange={handleInput} driverNames={driverNames} prefix="sp-pole" />
                </label>
                <label>
                  Sprint rating (1-10)
                  <input type="number" min="1" max="10" name="sprintRating" value={form.sprintRating} onChange={handleInput} />
                </label>
              </div>
              <div className="positions-grid">
                {[...Array(8)].map((_, i) => {
                  const pos = i + 1
                  const field = `sprintP${pos}Driver`
                  return (
                    <div key={pos} className="pos-row">
                      <span className={`pos-badge ${RACE_POS_BADGE(pos)}`}>S{pos}</span>
                      <DriverSelect
                        name={field}
                        value={form[field]}
                        onChange={handleInput}
                        driverNames={driverNames}
                        prefix={`sp${pos}`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Incidents ── */}
          <h3 className="full-row section-heading">Incidents</h3>

          <label>
            DNF drivers (comma separated)
            <input name="dnfDrivers" value={form.dnfDrivers} onChange={handleInput} />
          </label>

          <label>
            Safety cars
            <input type="number" min="0" name="safetyCars" value={form.safetyCars} onChange={handleInput} />
          </label>

          <label>
            Red flags
            <input type="number" min="0" name="redFlags" value={form.redFlags} onChange={handleInput} />
          </label>

          {/* ── My Take ── */}
          <h3 className="full-row section-heading">My Take</h3>

          <label>
            Race rating (1-10)
            <input type="number" min="1" max="10" name="raceRating" value={form.raceRating} onChange={handleInput} />
          </label>

          <label>
            Best overtake
            <input name="bestOvertake" value={form.bestOvertake} onChange={handleInput} />
          </label>

          <label>
            Surprise of the race
            <input name="surprise" value={form.surprise} onChange={handleInput} />
          </label>

          <label>
            Disappointment
            <input name="disappointment" value={form.disappointment} onChange={handleInput} />
          </label>

          <label className="full-row">
            Notes
            <textarea name="notes" rows={3} value={form.notes} onChange={handleInput} />
          </label>

          <button type="submit" className="primary full-row">
            Save race entry
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Latest race entries</h2>
        {raceJournal.length === 0 ? (
          <p>No race entries yet.</p>
        ) : (
          <ul className="stack-list">
            {raceJournal.slice(0, 10).map((entry) => {
              const fmt = entry.weekendFormat?.type ?? entry.format ?? 'standard'
              return (
                <li key={entry.id} className="race-entry-card">
                  <div className="card-headline">
                    <div className="race-entry-title">
                      <span className="format-chip">{FORMAT_LABEL[fmt] ?? '🏁 Race'}</span>
                      <strong>{entry.grandPrix}</strong>
                    </div>
                    <button
                      type="button"
                      className="fav-btn"
                      onClick={() => toggleFavorite('race', entry.id)}
                      title={favoriteSet.has(`race:${entry.id}`) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {favoriteSet.has(`race:${entry.id}`) ? '★' : '☆'}
                    </button>
                  </div>

                  <div className="race-meta">
                    <span>{entry.date || '—'}</span>
                    <span>{WEATHER_ICON[entry.weather] ?? ''} {entry.weather}</span>
                    <span className="race-rating-chip">{entry.raceRating}/10</span>
                  </div>

                  <div className="podium-row">
                    <span className="podium-pos gold">P1 {entry.p1Driver || '—'}</span>
                    <span className="podium-pos silver">P2 {entry.p2Driver || '—'}</span>
                    <span className="podium-pos bronze">P3 {entry.p3Driver || '—'}</span>
                  </div>

                  {(entry.polePosition || entry.fastestLap) && (
                    <p className="race-stat-line">
                      {entry.polePosition && <>⚡ Pole: <strong>{entry.polePosition}</strong></>}
                      {entry.polePosition && entry.fastestLap && ' · '}
                      {entry.fastestLap && <>FL: <strong>{entry.fastestLap}</strong></>}
                    </p>
                  )}

                  {entry.weekendFormat?.sprint_points && entry.sprintP1Driver && (
                    <p className="race-stat-line">
                      <span className="chip sprint-chip">SPRINT</span>{' '}
                      {entry.sprintP1Driver} wins · Pole: {entry.sprintPoleSitter || '—'}
                    </p>
                  )}

                  {entry.notes && <p className="race-notes">{entry.notes}</p>}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </section>
  )
}

export default RaceJournalPage
