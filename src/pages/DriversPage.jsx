import { useEffect, useMemo, useState } from 'react'

const emptyForm = {
  rating: 0,
  bestRacePerformance: '',
  drivingStyleNotes: '',
  seasonPerformanceNotes: '',
  personalComments: '',
}

function DriversPage({ drivers, driverJournal, favoriteSet, upsertDriverJournal, toggleFavorite }) {
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.id ?? '')

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

  const handleSelect = (driverId) => {
    setSelectedDriverId(driverId)
    const note = driverJournal.find((item) => item.driverId === driverId) ?? emptyForm
    setForm(note)
  }

  const handleInput = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    upsertDriverJournal({ ...form, driverId: selectedDriver.id })
  }

  return (
    <section className="screen-grid two-col">
      <section className="card">
        <h2>Drivers</h2>
        <ul className="entity-list">
          {drivers.map((driver) => {
            const note = driverJournal.find((item) => item.driverId === driver.id)
            return (
              <li key={driver.id} className={driver.id === selectedDriver.id ? 'is-active' : ''}>
                <button type="button" onClick={() => handleSelect(driver.id)}>
                  <div>
                    <strong>{driver.name}</strong>
                    <span>
                      {driver.team} - {driver.nationality}
                    </span>
                  </div>
                  <small>{'★'.repeat(note?.rating || 0) || 'No rating'}</small>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="card">
        <div className="card-headline">
          <h2>{selectedDriver.name}</h2>
          <button
            type="button"
            className="ghost"
            onClick={() => toggleFavorite('driver', selectedDriver.id)}
          >
            {favoriteSet.has(`driver:${selectedDriver.id}`) ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>

        <form className="editor-form" onSubmit={handleSave}>
          <label>
            Team
            <input value={selectedDriver.team} readOnly />
          </label>

          <label>
            Personal rating (1-5)
            <input name="rating" type="number" min="0" max="5" value={form.rating} onChange={handleInput} />
          </label>

          <label>
            Best race performance you've seen
            <input name="bestRacePerformance" value={form.bestRacePerformance} onChange={handleInput} />
          </label>

          <label>
            Driving style notes
            <textarea name="drivingStyleNotes" rows={3} value={form.drivingStyleNotes} onChange={handleInput} />
          </label>

          <label>
            Season performance notes
            <textarea
              name="seasonPerformanceNotes"
              rows={3}
              value={form.seasonPerformanceNotes}
              onChange={handleInput}
            />
          </label>

          <label>
            Personal comments
            <textarea name="personalComments" rows={3} value={form.personalComments} onChange={handleInput} />
          </label>

          <button type="submit" className="primary">
            Save driver notes
          </button>
        </form>
      </section>
    </section>
  )
}

export default DriversPage
