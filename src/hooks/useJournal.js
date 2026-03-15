import { useMemo, useState } from 'react'
import { DRIVERS } from '../constants/drivers'
import { TRACKS } from '../constants/tracks'
import { loadJournalData, saveJournalData } from '../localstorage/journalStorage'
import { createJournalEntry, createJournalUser } from '../models/journal.model'

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const getInitialState = () => {
  const persisted = loadJournalData()

  if (persisted.users.length === 0) {
    const defaultUser = createJournalUser({ id: createId(), name: 'Andru' })
    const initial = { users: [defaultUser], entries: [] }
    saveJournalData(initial)
    return initial
  }

  return persisted
}

export function useJournal() {
  const [store, setStore] = useState(getInitialState)
  const [activeUserId, setActiveUserId] = useState(store.users[0]?.id ?? null)

  const addUser = (name) => {
    if (!name.trim()) return

    const newUser = createJournalUser({ id: createId(), name: name.trim() })
    const nextStore = { ...store, users: [...store.users, newUser] }
    setStore(nextStore)
    setActiveUserId(newUser.id)
    saveJournalData(nextStore)
  }

  const addEntry = ({ trackId, driverId, session, weather, tyre, bestLap, notes }) => {
    if (!activeUserId) return

    const entry = createJournalEntry({
      id: createId(),
      userId: activeUserId,
      trackId,
      driverId,
      session,
      weather,
      tyre,
      bestLap,
      notes,
    })

    const nextStore = { ...store, entries: [entry, ...store.entries] }
    setStore(nextStore)
    saveJournalData(nextStore)
  }

  const activeUser = useMemo(
    () => store.users.find((user) => user.id === activeUserId) ?? null,
    [activeUserId, store.users]
  )

  const userEntries = useMemo(
    () => store.entries.filter((entry) => entry.userId === activeUserId),
    [activeUserId, store.entries]
  )

  return {
    tracks: TRACKS,
    drivers: DRIVERS,
    users: store.users,
    entries: userEntries,
    activeUser,
    activeUserId,
    setActiveUserId,
    addUser,
    addEntry,
  }
}
