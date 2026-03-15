import { useEffect, useMemo, useState } from 'react'

const emptyForm = {
  rating: 0,
  favoriteCorner: '',
  hardestSection: '',
  bestRaceRemembered: '',
  personalNotes: '',
}

function TracksPage({ t, tracks, trackJournal, favoriteSet, upsertTrackJournal, toggleFavorite }) {
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
        <h2>{t('tracks')}</h2>
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
                  <small>{'★'.repeat(note?.rating || 0) || t('noRating')}</small>
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
            {t('personalRating')}
            <input name="rating" type="number" min="0" max="5" value={form.rating} onChange={handleInput} />
          </label>

          <label>
            {t('favoriteCorner')}
            <input name="favoriteCorner" value={form.favoriteCorner} onChange={handleInput} />
          </label>

          <label>
            {t('hardestSection')}
            <input name="hardestSection" value={form.hardestSection} onChange={handleInput} />
          </label>

          <label>
            {t('bestRaceRemembered')}
            <input name="bestRaceRemembered" value={form.bestRaceRemembered} onChange={handleInput} />
          </label>

          <label>
            {t('personalNotes')}
            <textarea name="personalNotes" rows={4} value={form.personalNotes} onChange={handleInput} />
          </label>

          <button type="submit" className="primary">
            {t('saveTrackNotes')}
          </button>
        </form>
      </section>
    </section>
  )
}

export default TracksPage
