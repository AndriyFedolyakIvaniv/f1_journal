import { useMemo } from 'react'
import { CAR_IMAGES } from '../constants/carImages'

function SeasonStatsPage({ seasonStats, tracks, teams }) {
  const bestCircuitName = tracks.find((track) => track.id === seasonStats.bestCircuitByRace?.circuitId)?.name

  const teamIdByName = useMemo(() => {
    const map = new Map()
    teams.forEach((t) => map.set(t.name, t.id))
    return map
  }, [teams])

  return (
    <section className="screen-grid">
      <section className="metrics-grid">
        <article className="card metric-card">
          <p>Driver with most wins</p>
          <strong>{seasonStats.topWinner ? `${seasonStats.topWinner.driverName} (${seasonStats.topWinner.wins})` : 'No data'}</strong>
        </article>
        <article className="card metric-card">
          <p>Driver with most podiums</p>
          <strong>{seasonStats.topPodium ? `${seasonStats.topPodium.driverName} (${seasonStats.topPodium.podiums})` : 'No data'}</strong>
        </article>
        <article className="card metric-card">
          <p>Team with most points</p>
          <strong>{seasonStats.topTeam ? `${seasonStats.topTeam.teamName} (${seasonStats.topTeam.points})` : 'No data'}</strong>
        </article>
        <article className="card metric-card">
          <p>Best race by rating</p>
          <strong>{seasonStats.bestRace ? `${seasonStats.bestRace.grandPrix} (${seasonStats.bestRace.raceRating}/10)` : 'No data'}</strong>
        </article>
        <article className="card metric-card">
          <p>Circuit with best races</p>
          <strong>
            {seasonStats.bestCircuitByRace ? `${bestCircuitName ?? seasonStats.bestCircuitByRace.circuitId} (${seasonStats.bestCircuitByRace.average})` : 'No data'}
          </strong>
        </article>
      </section>

      <section className="card">
        <h2>Season Leaderboard - Drivers</h2>
        <p>My Championship calculated from your logged races.</p>
        <table className="stats-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Driver</th>
              <th>Team</th>
              <th>Pts</th>
              <th>Wins</th>
              <th>Pdm</th>
              <th>Best</th>
            </tr>
          </thead>
          <tbody>
            {seasonStats.driverStandings.length ? (
              seasonStats.driverStandings.map((driver, index) => {
                const rowClass = index === 0 ? 'row-gold' : index === 1 ? 'row-silver' : index === 2 ? 'row-bronze' : ''
                return (
                  <tr key={driver.driverName} className={rowClass}>
                    <td>{index + 1}</td>
                    <td>{driver.driverName}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{driver.teamName}</td>
                    <td><strong>{driver.points}</strong></td>
                    <td>{driver.wins}</td>
                    <td>{driver.podiums}</td>
                    <td>{driver.bestResult === 99 ? '—' : `P${driver.bestResult}`}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7}>No races logged yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Constructor Standings</h2>
        <p>{teams.length} teams in this season database.</p>
        <table className="stats-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {seasonStats.constructorStandings.length ? (
              seasonStats.constructorStandings.map((team, index) => {
                const rowClass = index === 0 ? 'row-gold' : index === 1 ? 'row-silver' : index === 2 ? 'row-bronze' : ''
                return (
                  <tr key={team.teamName} className={rowClass}>
                    <td>{index + 1}</td>
                    <td className="constructor-cell">
                      {CAR_IMAGES[teamIdByName.get(team.teamName)] && (
                        <img
                          src={CAR_IMAGES[teamIdByName.get(team.teamName)]}
                          className="car-thumb"
                          alt={team.teamName}
                        />
                      )}
                      {team.teamName}
                    </td>
                    <td><strong>{team.points}</strong></td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={2}>No team points yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </section>
  )
}

export default SeasonStatsPage
