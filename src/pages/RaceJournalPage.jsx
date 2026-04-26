import { useEffect, useState } from 'react'

const WEATHER_ICON = { dry: '☀️', rain: '🌧️', mixed: '🌦️' }


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
  p13Driver: '',
  p14Driver: '',
  p15Driver: '',
  p16Driver: '',
  p17Driver: '',
  p18Driver: '',
  p19Driver: '',
  p20Driver: '',
  p21Driver: '',
  p22Driver: '',
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

function DriverSelect({ name, value, onChange, driverNames, prefix, required, t }) {
  return (
    <select name={name} value={value} onChange={onChange} required={required}>
      <option value="">{t('driverPlaceholder')}</option>
      {driverNames.map((n) => (
        <option key={`${prefix}-${n}`} value={n}>
          {n}
        </option>
      ))}
    </select>
  )
}

const buildFormFromRace = (entry, tracks) => {
  const base = initialForm(tracks)
  if (!entry) return base

  const nextForm = {
    ...base,
    grandPrix: entry.grandPrix ?? base.grandPrix,
    circuitId: entry.circuitId ?? base.circuitId,
    date: entry.date ?? base.date,
    format: entry.format ?? base.format,
    weather: entry.weather ?? base.weather,
    polePosition: entry.polePosition ?? base.polePosition,
    fastestLap: entry.fastestLap ?? base.fastestLap,
    driverOfDay: entry.driverOfDay ?? base.driverOfDay,
    dnfDrivers: entry.dnfDrivers ?? base.dnfDrivers,
    safetyCars: entry.safetyCars ?? base.safetyCars,
    redFlags: entry.redFlags ?? base.redFlags,
    raceRating: entry.raceRating ?? base.raceRating,
    sprintRating: entry.sprintRating ?? base.sprintRating,
    bestOvertake: entry.bestOvertake ?? base.bestOvertake,
    surprise: entry.surprise ?? base.surprise,
    disappointment: entry.disappointment ?? base.disappointment,
    notes: entry.notes ?? base.notes,
    sprintPoleSitter: entry.sprintPoleSitter ?? base.sprintPoleSitter,
  }

  for (let position = 1; position <= 22; position += 1) {
    nextForm[`p${position}Driver`] = entry[`p${position}Driver`] ?? base[`p${position}Driver`]
  }

  for (let position = 1; position <= 8; position += 1) {
    nextForm[`sprintP${position}Driver`] = entry[`sprintP${position}Driver`] ?? base[`sprintP${position}Driver`]
  }

  return nextForm
}

function RaceJournalPage({
  t,
  tracks,
  drivers,
  raceJournal,
  favoriteSet,
  addRaceEntry,
  toggleFavorite,
  raceTemplateSeed,
  onLoadLatestRaceTemplate,
  onConsumeRaceTemplate,
}) {
  const [form, setForm] = useState(initialForm(tracks))

  const driverNames = drivers.map((driver) => driver.name)
  const isSprint = form.format === 'sprint' || form.format === 'experimental'
  const formatLabel = {
    standard: `🏁 ${t('formatRace')}`,
    sprint: `⚡ ${t('formatSprint')}`,
    experimental: `🧪 ${t('formatExperimental')}`,
  }

  const handleInput = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (!raceTemplateSeed) return

    setForm(buildFormFromRace(raceTemplateSeed, tracks))
    onConsumeRaceTemplate()
  }, [raceTemplateSeed, tracks, onConsumeRaceTemplate])

  const handleSubmit = (event) => {
    event.preventDefault()
    addRaceEntry(form)
    setForm(initialForm(tracks))
  }

  return (
    <section className="screen-grid">
      <section className="card race-builder-card">
        <div className="card-headline race-builder-headline">
          <div>
            <p className="eyebrow">{t('raceHeroKicker')}</p>
            <h2>{t('raceDiaryEntry')}</h2>
            <p className="card-subtitle">{t('raceHeroSubtitle')}</p>
          </div>
          <button
            type="button"
            className="secondary-action"
            onClick={onLoadLatestRaceTemplate}
            disabled={!raceJournal.length}
          >
            {t('raceUseLastRace')}
          </button>
        </div>

        <div className="hero-inline-note">
          <span>{t('raceTemplateHint')}</span>
          <strong>{raceJournal[0]?.grandPrix ?? t('raceTemplateEmpty')}</strong>
        </div>

        <form className="race-form" onSubmit={handleSubmit}>

          {/* ── GP Info ── */}
          <label>
            {t('grandPrixName')}
            <input name="grandPrix" value={form.grandPrix} onChange={handleInput} required />
          </label>

          <label>
            {t('circuit')}
            <select name="circuitId" value={form.circuitId} onChange={handleInput}>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t('date')}
            <input type="date" name="date" value={form.date} onChange={handleInput} />
          </label>

          <label>
            {t('weekendFormat')}
            <select name="format" value={form.format} onChange={handleInput}>
              <option value="standard">🏁 {t('formatStandard')}</option>
              <option value="sprint">⚡ {t('formatSprint')}</option>
              <option value="experimental">🧪 {t('formatExperimental')}</option>
            </select>
          </label>

          <label>
            {t('weather')}
            <select name="weather" value={form.weather} onChange={handleInput}>
              <option value="dry">☀️ {t('weatherDry')}</option>
              <option value="rain">🌧️ {t('weatherRain')}</option>
              <option value="mixed">🌦️ {t('weatherMixed')}</option>
            </select>
          </label>

          {/* ── Key Awards ── */}
          <div className="full-row">
            <h3 className="section-heading">{t('keyAwards')}</h3>
            <div className="awards-row">
              <label>
                {t('polePosition')}
                <DriverSelect name="polePosition" value={form.polePosition} onChange={handleInput} driverNames={driverNames} prefix="pole" t={t} />
              </label>
              <label>
                {t('fastestLap')}
                <DriverSelect name="fastestLap" value={form.fastestLap} onChange={handleInput} driverNames={driverNames} prefix="fl" t={t} />
              </label>
              <label>
                {t('driverOfDay')}
                <DriverSelect name="driverOfDay" value={form.driverOfDay} onChange={handleInput} driverNames={driverNames} prefix="dotd" t={t} />
              </label>
            </div>
          </div>

          {/* ── Race Classification ── */}
          <div className="full-row">
            <h3 className="section-heading">{t('raceClassification')}</h3>
            <div className="positions-grid">
              {[...Array(22)].map((_, i) => {
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
                      t={t}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Sprint Results (conditional) ── */}
          {isSprint && (
            <div className="full-row">
              <h3 className="section-heading">{t('sprintRaceResults')}</h3>
              <div className="awards-row" style={{ marginBottom: '10px' }}>
                <label>
                  {t('sprintShootoutPole')}
                  <DriverSelect name="sprintPoleSitter" value={form.sprintPoleSitter} onChange={handleInput} driverNames={driverNames} prefix="sp-pole" t={t} />
                </label>
                <label>
                  {t('sprintRating')}
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
                        t={t}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Incidents ── */}
          <h3 className="full-row section-heading">{t('incidents')}</h3>

          <label>
            {t('dnfDrivers')}
            <input name="dnfDrivers" value={form.dnfDrivers} onChange={handleInput} />
          </label>

          <label>
            {t('safetyCars')}
            <input type="number" min="0" name="safetyCars" value={form.safetyCars} onChange={handleInput} />
          </label>

          <label>
            {t('redFlags')}
            <input type="number" min="0" name="redFlags" value={form.redFlags} onChange={handleInput} />
          </label>

          {/* ── My Take ── */}
          <h3 className="full-row section-heading">{t('myTake')}</h3>

          <label>
            {t('raceRating')}
            <input type="number" min="1" max="10" name="raceRating" value={form.raceRating} onChange={handleInput} />
          </label>

          <label>
            {t('bestOvertake')}
            <input name="bestOvertake" value={form.bestOvertake} onChange={handleInput} />
          </label>

          <label>
            {t('surprise')}
            <input name="surprise" value={form.surprise} onChange={handleInput} />
          </label>

          <label>
            {t('disappointment')}
            <input name="disappointment" value={form.disappointment} onChange={handleInput} />
          </label>

          <label className="full-row">
            {t('notes')}
            <textarea name="notes" rows={3} value={form.notes} onChange={handleInput} />
          </label>

          <button type="submit" className="primary full-row">
            {t('saveRaceEntry')}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>{t('latestRaceEntries')}</h2>
        {raceJournal.length === 0 ? (
          <p>{t('noRaceEntries')}</p>
        ) : (
          <ul className="stack-list">
            {raceJournal.slice(0, 10).map((entry) => {
              const fmt = entry.weekendFormat?.type ?? entry.format ?? 'standard'
              return (
                <li key={entry.id} className="race-entry-card">
                  <div className="card-headline">
                    <div className="race-entry-title">
                      <span className="format-chip">{formatLabel[fmt] ?? `🏁 ${t('formatRace')}`}</span>
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
                      <span className="chip sprint-chip">{t('sprintChip')}</span>{' '}
                      {entry.sprintP1Driver} {t('wins')} · Pole: {entry.sprintPoleSitter || '—'}
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
