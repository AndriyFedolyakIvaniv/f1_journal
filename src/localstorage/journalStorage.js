const JOURNAL_STORAGE_KEY = 'f1-journal-v2'
const LEGACY_STORAGE_KEY = 'f1-journal-v1'

const safeJsonParse = (rawValue, fallback) => {
  try {
    return JSON.parse(rawValue)
  } catch {
    return fallback
  }
}

const createDefaultState = () => ({
  version: 2,
  users: [],
  activeUserId: null,
  driverJournal: [],
  trackJournal: [],
  raceJournal: [],
  favorites: [],
})

const normalizeCurrentData = (rawData) => {
  const base = createDefaultState()
  if (!rawData || typeof rawData !== 'object') return base

  return {
    ...base,
    ...rawData,
    users: Array.isArray(rawData.users) ? rawData.users : [],
    driverJournal: Array.isArray(rawData.driverJournal) ? rawData.driverJournal : [],
    trackJournal: Array.isArray(rawData.trackJournal) ? rawData.trackJournal : [],
    raceJournal: Array.isArray(rawData.raceJournal) ? rawData.raceJournal : [],
    favorites: Array.isArray(rawData.favorites) ? rawData.favorites : [],
  }
}

const migrateLegacyData = (legacyData) => {
  const migrated = createDefaultState()

  migrated.users = Array.isArray(legacyData.users) ? legacyData.users : []
  migrated.activeUserId = migrated.users[0]?.id ?? null

  const legacyEntries = Array.isArray(legacyData.entries) ? legacyData.entries : []
  migrated.raceJournal = legacyEntries.map((entry) => ({
    id: entry.id,
    userId: entry.userId,
    grandPrix: entry.session ? `${entry.session} Weekend` : 'Race Weekend',
    circuitId: entry.trackId,
    date: entry.createdAt?.slice(0, 10) ?? '',
    weather: entry.weather ?? '',
    winner: '',
    top3: [],
    bestOvertake: '',
    surpriseMoment: '',
    raceRating: 0,
    driverOfDay: entry.driverId ?? '',
    review: '',
    notes: entry.notes ?? '',
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  }))

  return migrated
}

export const loadJournalData = () => {
  const rawData = window.localStorage.getItem(JOURNAL_STORAGE_KEY)
  if (rawData) {
    const parsedData = safeJsonParse(rawData, createDefaultState())
    return normalizeCurrentData(parsedData)
  }

  const legacyData = window.localStorage.getItem(LEGACY_STORAGE_KEY)
  if (!legacyData) return createDefaultState()

  const parsedLegacy = safeJsonParse(legacyData, { users: [], entries: [] })
  const migrated = migrateLegacyData(parsedLegacy)
  saveJournalData(migrated)

  return migrated
}

export const saveJournalData = (data) => {
  window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(data))
}
