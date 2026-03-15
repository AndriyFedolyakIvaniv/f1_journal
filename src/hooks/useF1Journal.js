import { useMemo, useState } from 'react'
import { DRIVERS } from '../constants/drivers'
import { TRACKS } from '../constants/tracks'
import { TEAMS } from '../constants/teams'
import { loadJournalData, saveJournalData } from '../localstorage/journalStorage'

const POINTS_BY_POSITION = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1,
}

const SPRINT_POINTS_BY_POSITION = {
  1: 8,
  2: 7,
  3: 6,
  4: 5,
  5: 4,
  6: 3,
  7: 2,
  8: 1,
}

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const upsertBy = (items, predicate, nextItem) => {
  const index = items.findIndex(predicate)
  if (index === -1) return [nextItem, ...items]

  const clone = [...items]
  clone[index] = { ...clone[index], ...nextItem }
  return clone
}

const normalizeName = (value) => value.trim().toLowerCase()

const getParcFermeAfter = (format) => {
  if (format === 'sprint') return 'sprint_shootout'
  return 'qualifying'
}

const getWeekendSessions = (format) => {
  if (format === 'sprint') {
    return [
      'fp1',
      'sprint_shootout',
      'sprint',
      'qualifying',
      'race',
    ]
  }

  if (format === 'experimental') {
    return ['fp1', 'fp2', 'qualifying', 'sprint_shootout', 'sprint', 'race']
  }

  return ['fp1', 'fp2', 'fp3', 'qualifying', 'race']
}

const getDefaultStore = () => {
  const defaultUser = {
    id: createId(),
    name: 'Owner',
    createdAt: new Date().toISOString(),
  }

  return {
    version: 3,
    users: [defaultUser],
    activeUserId: defaultUser.id,
    driverJournal: [],
    trackJournal: [],
    raceJournal: [],
    favorites: [],
  }
}

const migrateRaceEntry = (entry) => {
  const top3 = Array.isArray(entry.top3) ? entry.top3 : []

  const format = entry.weekendFormat?.type ?? entry.format ?? entry.raceWeekend?.format ?? 'standard'
  const sessions = Array.isArray(entry.weekendFormat?.sessions)
    ? entry.weekendFormat.sessions
    : Array.isArray(entry.sessions)
      ? entry.sessions
      : getWeekendSessions(format)

  return {
    ...entry,
    condition: entry.condition ?? entry.weather ?? 'dry',
    format,
    sessions,
    weekendFormat: {
      type: format,
      sessions,
      sprint_points:
        entry.weekendFormat?.sprint_points ??
        entry.weekendFormat?.sprintPoints ??
        (format === 'sprint' || format === 'experimental'),
      parc_ferme_after:
        entry.weekendFormat?.parc_ferme_after ??
        entry.weekendFormat?.parcFermeAfter ??
        getParcFermeAfter(format),
    },
    raceWeekend: entry.raceWeekend ?? {
      id: `rw-${entry.id}`,
      grandPrix: entry.grandPrix ?? '',
      circuitId: entry.circuitId ?? '',
      date: entry.date ?? '',
      format,
    },
    polePosition: entry.polePosition ?? '',
    fastestLap: entry.fastestLap ?? '',
    dnfDrivers: entry.dnfDrivers ?? '',
    safetyCars: Number(entry.safetyCars) || 0,
    redFlags: Number(entry.redFlags) || 0,
    p1Driver: entry.p1Driver ?? top3[0] ?? entry.winner ?? '',
    p2Driver: entry.p2Driver ?? top3[1] ?? '',
    p3Driver: entry.p3Driver ?? top3[2] ?? '',
    p4Driver: entry.p4Driver ?? '',
    p5Driver: entry.p5Driver ?? '',
    p6Driver: entry.p6Driver ?? '',
    p7Driver: entry.p7Driver ?? '',
    p8Driver: entry.p8Driver ?? '',
    p9Driver: entry.p9Driver ?? '',
    p10Driver: entry.p10Driver ?? '',
    p11Driver: entry.p11Driver ?? '',
    p12Driver: entry.p12Driver ?? '',
    p13Driver: entry.p13Driver ?? '',
    p14Driver: entry.p14Driver ?? '',
    p15Driver: entry.p15Driver ?? '',
    p16Driver: entry.p16Driver ?? '',
    p17Driver: entry.p17Driver ?? '',
    p18Driver: entry.p18Driver ?? '',
    p19Driver: entry.p19Driver ?? '',
    p20Driver: entry.p20Driver ?? '',
    p21Driver: entry.p21Driver ?? '',
    p22Driver: entry.p22Driver ?? '',
    winner: entry.winner ?? top3[0] ?? '',
    bestOvertake: entry.bestOvertake ?? '',
    surprise: entry.surprise ?? entry.surpriseMoment ?? '',
    disappointment: entry.disappointment ?? '',
    raceRating: Number(entry.raceRating) || 0,
    driverOfDay: entry.driverOfDay ?? '',
  }
}

const getInitialStore = () => {
  const loaded = loadJournalData()
  if (!loaded.users.length) {
    const initial = getDefaultStore()
    saveJournalData(initial)
    return initial
  }

  return {
    ...loaded,
    version: 3,
    raceJournal: Array.isArray(loaded.raceJournal) ? loaded.raceJournal.map(migrateRaceEntry) : [],
  }
}

const getTopFrequency = (values) => {
  if (!values.length) return { key: null, count: 0 }

  const counts = values.reduce((acc, item) => {
    if (!item) return acc
    acc[item] = (acc[item] ?? 0) + 1
    return acc
  }, {})

  let topKey = null
  let topCount = 0

  Object.entries(counts).forEach(([key, count]) => {
    if (count > topCount) {
      topKey = key
      topCount = count
    }
  })

  return { key: topKey, count: topCount }
}

const getRaceTop10 = (entry) => [
  entry.p1Driver,
  entry.p2Driver,
  entry.p3Driver,
  entry.p4Driver,
  entry.p5Driver,
  entry.p6Driver,
  entry.p7Driver,
  entry.p8Driver,
  entry.p9Driver,
  entry.p10Driver,
].map((item) => (item ?? '').trim())

const getSprintTop8 = (entry) => [
  entry.sprintP1Driver,
  entry.sprintP2Driver,
  entry.sprintP3Driver,
  entry.sprintP4Driver,
  entry.sprintP5Driver,
  entry.sprintP6Driver,
  entry.sprintP7Driver,
  entry.sprintP8Driver,
].map((item) => (item ?? '').trim())

export function useF1Journal() {
  const [store, setStore] = useState(getInitialStore)

  const persist = (nextStore) => {
    setStore(nextStore)
    saveJournalData(nextStore)
  }

  const addUser = (name) => {
    if (!name.trim()) return

    const user = {
      id: createId(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    }

    persist({
      ...store,
      users: [...store.users, user],
      activeUserId: user.id,
    })
  }

  const setActiveUserId = (userId) => {
    persist({ ...store, activeUserId: userId })
  }

  const upsertDriverJournal = (payload) => {
    if (!store.activeUserId) return

    const nextItem = {
      id: payload.id ?? createId(),
      userId: store.activeUserId,
      driverId: payload.driverId,
      rating: Number(payload.rating) || 0,
      bestRacePerformance: payload.bestRacePerformance ?? '',
      drivingStyleNotes: payload.drivingStyleNotes ?? '',
      seasonPerformanceNotes: payload.seasonPerformanceNotes ?? '',
      personalComments: payload.personalComments ?? '',
      updatedAt: new Date().toISOString(),
    }

    const nextList = upsertBy(
      store.driverJournal,
      (item) => item.userId === store.activeUserId && item.driverId === payload.driverId,
      nextItem
    )

    persist({ ...store, driverJournal: nextList })
  }

  const upsertTrackJournal = (payload) => {
    if (!store.activeUserId) return

    const nextItem = {
      id: payload.id ?? createId(),
      userId: store.activeUserId,
      trackId: payload.trackId,
      rating: Number(payload.rating) || 0,
      favoriteCorner: payload.favoriteCorner ?? '',
      hardestSection: payload.hardestSection ?? '',
      bestRaceRemembered: payload.bestRaceRemembered ?? '',
      personalNotes: payload.personalNotes ?? '',
      updatedAt: new Date().toISOString(),
    }

    const nextList = upsertBy(
      store.trackJournal,
      (item) => item.userId === store.activeUserId && item.trackId === payload.trackId,
      nextItem
    )

    persist({ ...store, trackJournal: nextList })
  }

  const addRaceEntry = (payload) => {
    if (!store.activeUserId) return

    const weekendFormat = {
      type: payload.format,
      sessions: getWeekendSessions(payload.format),
      sprint_points: payload.format === 'sprint' || payload.format === 'experimental',
      parc_ferme_after: getParcFermeAfter(payload.format),
    }

    const entry = {
      id: createId(),
      userId: store.activeUserId,
      grandPrix: payload.grandPrix,
      circuitId: payload.circuitId,
      date: payload.date,
      weather: payload.weather,
      condition: payload.weather,
      format: payload.format,
      weekendFormat,
      raceWeekend: {
        id: createId(),
        grandPrix: payload.grandPrix,
        circuitId: payload.circuitId,
        date: payload.date,
        format: payload.format,
      },
      sessions: weekendFormat.sessions,
      polePosition: payload.polePosition,
      fastestLap: payload.fastestLap,
      driverOfDay: payload.driverOfDay,
      p1Driver: payload.p1Driver,
      p2Driver: payload.p2Driver,
      p3Driver: payload.p3Driver,
      p4Driver: payload.p4Driver,
      p5Driver: payload.p5Driver,
      p6Driver: payload.p6Driver,
      p7Driver: payload.p7Driver,
      p8Driver: payload.p8Driver,
      p9Driver: payload.p9Driver,
      p10Driver: payload.p10Driver,
      p11Driver: payload.p11Driver,
      p12Driver: payload.p12Driver,
      p13Driver: payload.p13Driver,
      p14Driver: payload.p14Driver,
      p15Driver: payload.p15Driver,
      p16Driver: payload.p16Driver,
      p17Driver: payload.p17Driver,
      p18Driver: payload.p18Driver,
      p19Driver: payload.p19Driver,
      p20Driver: payload.p20Driver,
      p21Driver: payload.p21Driver,
      p22Driver: payload.p22Driver,
      winner: payload.p1Driver,
      // Sprint race fields (only relevant for sprint/experimental formats)
      sprintPoleSitter: payload.sprintPoleSitter || '',
      sprintP1Driver: payload.sprintP1Driver || '',
      sprintP2Driver: payload.sprintP2Driver || '',
      sprintP3Driver: payload.sprintP3Driver || '',
      sprintP4Driver: payload.sprintP4Driver || '',
      sprintP5Driver: payload.sprintP5Driver || '',
      sprintP6Driver: payload.sprintP6Driver || '',
      sprintP7Driver: payload.sprintP7Driver || '',
      sprintP8Driver: payload.sprintP8Driver || '',
      sprintRating: Number(payload.sprintRating) || 0,
      dnfDrivers: payload.dnfDrivers,
      safetyCars: Number(payload.safetyCars) || 0,
      redFlags: Number(payload.redFlags) || 0,
      raceRating: Number(payload.raceRating) || 0,
      bestOvertake: payload.bestOvertake,
      surprise: payload.surprise,
      disappointment: payload.disappointment,
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    persist({ ...store, raceJournal: [entry, ...store.raceJournal] })
  }

  const toggleFavorite = (type, referenceId) => {
    if (!store.activeUserId) return

    const existing = store.favorites.find(
      (item) => item.userId === store.activeUserId && item.type === type && item.referenceId === referenceId
    )

    if (existing) {
      persist({
        ...store,
        favorites: store.favorites.filter((item) => item.id !== existing.id),
      })
      return
    }

    const nextFavorite = {
      id: createId(),
      userId: store.activeUserId,
      type,
      referenceId,
      createdAt: new Date().toISOString(),
    }

    persist({ ...store, favorites: [nextFavorite, ...store.favorites] })
  }

  const activeUser = useMemo(
    () => store.users.find((user) => user.id === store.activeUserId) ?? null,
    [store.activeUserId, store.users]
  )

  const userDriverJournal = useMemo(
    () => store.driverJournal.filter((item) => item.userId === store.activeUserId),
    [store.activeUserId, store.driverJournal]
  )

  const userTrackJournal = useMemo(
    () => store.trackJournal.filter((item) => item.userId === store.activeUserId),
    [store.activeUserId, store.trackJournal]
  )

  const userRaceJournal = useMemo(
    () => store.raceJournal.filter((item) => item.userId === store.activeUserId),
    [store.activeUserId, store.raceJournal]
  )

  const userFavorites = useMemo(
    () => store.favorites.filter((item) => item.userId === store.activeUserId),
    [store.activeUserId, store.favorites]
  )

  const favoriteSet = useMemo(() => {
    return new Set(userFavorites.map((item) => `${item.type}:${item.referenceId}`))
  }, [userFavorites])

  const driverByName = useMemo(() => {
    const map = new Map()
    DRIVERS.forEach((driver) => {
      map.set(normalizeName(driver.name), driver)
    })
    return map
  }, [])

  const seasonDriverMap = useMemo(() => {
    const map = new Map()

    const ensureStanding = (name) => {
      const existing = map.get(name)
      if (existing) return existing

      const created = {
        driverName: name,
        points: 0,
        wins: 0,
        podiums: 0,
        bestResult: 99,
        teamName: driverByName.get(normalizeName(name))?.team ?? 'Independent Entry',
      }

      map.set(name, created)
      return created
    }

    userRaceJournal.forEach((entry) => {
      const top10 = getRaceTop10(entry)
      top10.forEach((name, index) => {
        if (!name) return

        const existing = ensureStanding(name)

        const position = index + 1
        existing.points += POINTS_BY_POSITION[position] ?? 0
        if (position === 1) existing.wins += 1
        if (position <= 3) existing.podiums += 1
        if (position < existing.bestResult) existing.bestResult = position
      })

      const hasSprintPoints =
        entry.weekendFormat?.sprint_points ?? (entry.format === 'sprint' || entry.format === 'experimental')

      if (!hasSprintPoints) return

      const sprintTop8 = getSprintTop8(entry)
      sprintTop8.forEach((name, index) => {
        if (!name) return

        const existing = ensureStanding(name)
        const sprintPosition = index + 1
        existing.points += SPRINT_POINTS_BY_POSITION[sprintPosition] ?? 0
      })
    })

    return map
  }, [driverByName, userRaceJournal])

  const driverStandings = useMemo(() => {
    return [...seasonDriverMap.values()].sort((a, b) => b.points - a.points || b.wins - a.wins)
  }, [seasonDriverMap])

  const constructorStandings = useMemo(() => {
    const teamMap = new Map()

    TEAMS.forEach((team) => {
      teamMap.set(team.name, { teamName: team.name, points: 0 })
    })

    driverStandings.forEach((driver) => {
      const current = teamMap.get(driver.teamName) ?? { teamName: driver.teamName, points: 0 }
      current.points += driver.points
      teamMap.set(driver.teamName, current)
    })

    return [...teamMap.values()].sort((a, b) => b.points - a.points)
  }, [driverStandings])

  const recentRace = userRaceJournal[0] ?? null
  const recentDriverNote = userDriverJournal[0] ?? null
  const recentTrackNote = userTrackJournal[0] ?? null

  const highestRatedRace = userRaceJournal.reduce((best, item) => {
    if (!best || item.raceRating > best.raceRating) return item
    return best
  }, null)

  const highestRatedCircuitNote = userTrackJournal.reduce((best, item) => {
    if (!best || item.rating > best.rating) return item
    return best
  }, null)

  const avgRaceRating = userRaceJournal.length
    ? Number(
        (userRaceJournal.reduce((sum, item) => sum + (Number(item.raceRating) || 0), 0) /
          userRaceJournal.length).toFixed(1)
      )
    : 0

  const driverOfDayTop = getTopFrequency(userRaceJournal.map((item) => item.driverOfDay))

  const highestRatedDriverNote = userDriverJournal.reduce((best, item) => {
    if (!best || item.rating > best.rating) return item
    return best
  }, null)

  const highestRatedDriverName = highestRatedDriverNote
    ? (DRIVERS.find((d) => d.id === highestRatedDriverNote.driverId)?.name ?? null)
    : null

  const favoriteDriver = userFavorites.find((item) => item.type === 'driver')
  const favoriteTrack = userFavorites.find((item) => item.type === 'track')

  const mostWinsDriver = driverStandings[0] ?? null
  const mostPodiumsDriver = [...driverStandings].sort((a, b) => b.podiums - a.podiums)[0] ?? null
  const topTeam = constructorStandings[0] ?? null

  const circuitRatings = userRaceJournal.reduce((acc, race) => {
    if (!race.circuitId) return acc

    const current = acc[race.circuitId] ?? { total: 0, count: 0 }
    current.total += Number(race.raceRating) || 0
    current.count += 1
    acc[race.circuitId] = current
    return acc
  }, {})

  let bestCircuitByRace = null
  Object.entries(circuitRatings).forEach(([circuitId, value]) => {
    const average = value.total / value.count
    if (!bestCircuitByRace || average > bestCircuitByRace.average) {
      bestCircuitByRace = { circuitId, average: Number(average.toFixed(2)) }
    }
  })

  const dashboard = {
    racesLogged: userRaceJournal.length,
    favoriteDriverId: favoriteDriver?.referenceId ?? null,
    favoriteTrackId: favoriteTrack?.referenceId ?? null,
    highestRatedRaceId: highestRatedRace?.id ?? null,
    recentRace,
    recentDriverNote,
    recentTrackNote,
  }

  const stats = {
    mostRatedDriverName: highestRatedDriverName,
    mostRatedDriverCount: highestRatedDriverNote?.rating ?? 0,
    highestRatedCircuitId: highestRatedCircuitNote?.trackId ?? null,
    averageRaceRating: avgRaceRating,
    racesLogged: userRaceJournal.length,
    favoriteDriverFrequency: driverOfDayTop.count,
  }

  const seasonStats = {
    driverStandings,
    constructorStandings,
    topWinner: mostWinsDriver,
    topPodium: mostPodiumsDriver,
    topTeam,
    bestRace: highestRatedRace,
    bestCircuitByRace,
  }

  return {
    drivers: DRIVERS,
    teams: TEAMS,
    tracks: TRACKS,
    users: store.users,
    activeUser,
    activeUserId: store.activeUserId,
    driverJournal: userDriverJournal,
    trackJournal: userTrackJournal,
    raceJournal: userRaceJournal,
    favorites: userFavorites,
    favoriteSet,
    dashboard,
    stats,
    seasonStats,
    setActiveUserId,
    addUser,
    upsertDriverJournal,
    upsertTrackJournal,
    addRaceEntry,
    toggleFavorite,
  }
}
