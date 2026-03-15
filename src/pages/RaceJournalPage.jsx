import { useState } from 'react'

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
  // Sprint weekend fields
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

function RaceJournalPage({ tracks, drivers, raceJournal, favoriteSet, addRaceEntry, toggleFavorite }) {
  const [form, setForm] = useState(initialForm(tracks))

  const driverNames = drivers.map((driver) => driver.name)

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
        <form className="editor-form race-form" onSubmit={handleSubmit}>
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
              <option value="standard">Standard</option>
              <option value="sprint">Sprint</option>
              <option value="experimental">Experimental</option>
            </select>
          </label>

          <label>
            Weather conditions
            <select name="weather" value={form.weather} onChange={handleInput}>
              <option value="dry">Dry</option>
              <option value="rain">Rain</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>

          <label>
            Pole position
            <select name="polePosition" value={form.polePosition} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`pole-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fastest lap
            <select name="fastestLap" value={form.fastestLap} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`fl-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Driver of the day
            <select name="driverOfDay" value={form.driverOfDay} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`dotd-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P1 driver
            <select name="p1Driver" value={form.p1Driver} onChange={handleInput} required>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p1-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P2 driver
            <select name="p2Driver" value={form.p2Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p2-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P3 driver
            <select name="p3Driver" value={form.p3Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p3-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P4 driver
            <select name="p4Driver" value={form.p4Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p4-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P5 driver
            <select name="p5Driver" value={form.p5Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p5-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P6 driver
            <select name="p6Driver" value={form.p6Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p6-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P7 driver
            <select name="p7Driver" value={form.p7Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p7-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P8 driver
            <select name="p8Driver" value={form.p8Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p8-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P9 driver
            <select name="p9Driver" value={form.p9Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p9-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P10 driver
            <select name="p10Driver" value={form.p10Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p10-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P11 driver
            <select name="p11Driver" value={form.p11Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p11-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            P12 driver
            <select name="p12Driver" value={form.p12Driver} onChange={handleInput}>
              <option value="">Select driver</option>
              {driverNames.map((name) => (
                <option key={`p12-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          {(form.format === 'sprint' || form.format === 'experimental') && (
            <>
              <h3 className="full-row section-heading">Sprint Race Results</h3>

              <label>
                Sprint Shootout pole
                <select name="sprintPoleSitter" value={form.sprintPoleSitter} onChange={handleInput}>
                  <option value="">Select driver</option>
                  {driverNames.map((name) => (
                    <option key={`sp-pole-${name}`} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              {[1, 2, 3, 4, 5, 6, 7, 8].map((pos) => (
                <label key={`sprint-p${pos}`}>
                  Sprint P{pos}
                  <select
                    name={`sprintP${pos}Driver`}
                    value={form[`sprintP${pos}Driver`]}
                    onChange={handleInput}
                  >
                    <option value="">Select driver</option>
                    {driverNames.map((name) => (
                      <option key={`sp${pos}-${name}`} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
              ))}

              <label>
                Sprint rating (1-10)
                <input
                  type="number"
                  min="1"
                  max="10"
                  name="sprintRating"
                  value={form.sprintRating}
                  onChange={handleInput}
                />
              </label>
            </>
          )}

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

          <label>
            Best overtake
            <input name="bestOvertake" value={form.bestOvertake} onChange={handleInput} />
          </label>

          <label>
            Race rating (1-10)
            <input
              type="number"
              min="1"
              max="10"
              name="raceRating"
              value={form.raceRating}
              onChange={handleInput}
            />
          </label>

          <label>
            Surprise of the race
            <input name="surprise" value={form.surprise} onChange={handleInput} />
          </label>

          <label>
            Disappointment of the race
            <input name="disappointment" value={form.disappointment} onChange={handleInput} />
          </label>

          <label className="full-row">
            Notes
            <textarea name="notes" rows={4} value={form.notes} onChange={handleInput} />
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
          <ul className="stack-list race-list">
            {raceJournal.slice(0, 10).map((entry) => (
              <li key={entry.id}>
                <div className="card-headline">
                  <strong>{entry.grandPrix}</strong>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => toggleFavorite('race', entry.id)}
                  >
                    {favoriteSet.has(`race:${entry.id}`) ? 'Unfavorite' : 'Favorite'}
                  </button>
                </div>
                <span>
                  {entry.date || 'No date'} - {entry.weather || 'No weather'}
                </span>
                <p>
                  Rating: {entry.raceRating}/10 | Winner: {entry.p1Driver || entry.winner || 'N/A'} | Pole:{' '}
                  {entry.polePosition || 'N/A'}
                </p>
                <p>
                  Top 3: {[entry.p1Driver, entry.p2Driver, entry.p3Driver].filter(Boolean).join(', ') || 'No podium yet'}
                </p>
                {entry.weekendFormat?.sprint_points && entry.sprintP1Driver && (
                  <p>
                    <span className="chip sprint-chip">SPRINT</span>{' '}
                    Winner: {entry.sprintP1Driver} | Pole: {entry.sprintPoleSitter || 'N/A'}
                  </p>
                )}
                <p>{entry.notes || 'No comments yet.'}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}

export default RaceJournalPage
