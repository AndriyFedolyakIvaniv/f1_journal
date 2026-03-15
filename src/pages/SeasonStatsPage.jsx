function SeasonStatsPage({ seasonStats, tracks, teams }) {
  const bestCircuitName = tracks.find((track) => track.id === seasonStats.bestCircuitByRace?.circuitId)?.name

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
              <th>Driver</th>
              <th>Points</th>
              <th>Wins</th>
              <th>Podiums</th>
              <th>Best Result</th>
            </tr>
          </thead>
          <tbody>
            {seasonStats.driverStandings.length ? (
              seasonStats.driverStandings.map((driver) => (
                <tr key={driver.driverName}>
                  <td>{driver.driverName}</td>
                  <td>{driver.points}</td>
                  <td>{driver.wins}</td>
                  <td>{driver.podiums}</td>
                  <td>{driver.bestResult === 99 ? '-' : `P${driver.bestResult}`}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No races logged yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Constructor Standings</h2>
        <p>{teams.length} teams loaded in this season database.</p>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {seasonStats.constructorStandings.length ? (
              seasonStats.constructorStandings.map((team) => (
                <tr key={team.teamName}>
                  <td>{team.teamName}</td>
                  <td>{team.points}</td>
                </tr>
              ))
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
