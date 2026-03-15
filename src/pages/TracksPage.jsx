import { useEffect, useMemo, useState } from 'react'

const emptyForm = {
  rating: 0,
  favoriteCorner: '',
  hardestSection: '',
  bestRaceRemembered: '',
  personalNotes: '',
}

function TracksPage({ tracks, trackJournal, favoriteSet, upsertTrackJournal, toggleFavorite }) {
  const [selectedTrackId, setSelectedTrackId] = useState(tracks[0]?.id ?? '')

  const selectedTrack = useMemo(
    () => tracks.find((item) => item.id === selectedTrackId) ?? tracks[0],
    [selectedTrackId, tracks]
  )

  const selectedNote = useMemo(
    () => trackJournal.find((item) => item.trackId === selectedTrack?.id) ?? emptyForm,
    [selectedTrack?.id, trackJournal]
  )

  const [form, setForm] = useState(selectedNote)

  useEffect(() => {
    setForm(selectedNote)
  }, [selectedNote])

  const handleSelect = (trackId) => {
    setSelectedTrackId(trackId)
    const note = trackJournal.find((item) => item.trackId === trackId) ?? emptyForm
    setForm(note)
  }

  const handleInput = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    upsertTrackJournal({ ...form, trackId: selectedTrack.id })
  }

  return (
    <section className="screen-grid two-col">
      <section className="card">
        <h2>Tracks</h2>
        <ul className="entity-list">
          {tracks.map((track) => {
            const note = trackJournal.find((item) => item.trackId === track.id)
            return (
              <li key={track.id} className={track.id === selectedTrack.id ? 'is-active' : ''}>
                <button type="button" onClick={() => handleSelect(track.id)}>
                  <div>
                    <strong>{track.name}</strong>
                    <span>
                      {track.city}, {track.country} - {track.lapLength ?? track.lengthKm} km
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
          <h2>{selectedTrack.name}</h2>
          <button
            type="button"
            className="fav-btn"
            onClick={() => toggleFavorite('track', selectedTrack.id)}
            title={favoriteSet.has(`track:${selectedTrack.id}`) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favoriteSet.has(`track:${selectedTrack.id}`) ? '★' : '☆'}
          </button>
        </div>

        <form className="editor-form" onSubmit={handleSave}>
          <label>
            Personal rating (1-5)
            <input name="rating" type="number" min="0" max="5" value={form.rating} onChange={handleInput} />
          </label>

          <label>
            Favorite corner
            <input name="favoriteCorner" value={form.favoriteCorner} onChange={handleInput} />
          </label>

          <label>
            Hardest section
            <input name="hardestSection" value={form.hardestSection} onChange={handleInput} />
          </label>

          <label>
            Best race remembered at this circuit
            <input name="bestRaceRemembered" value={form.bestRaceRemembered} onChange={handleInput} />
          </label>

          <label>
            Personal notes
            <textarea name="personalNotes" rows={4} value={form.personalNotes} onChange={handleInput} />
          </label>

          <button type="submit" className="primary">
            Save track notes
          </button>
        </form>
      </section>
    </section>
  )
}

export default TracksPage
