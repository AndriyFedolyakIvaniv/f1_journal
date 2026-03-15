export const createJournalUser = ({ id, name }) => ({
  id,
  name,
  createdAt: new Date().toISOString(),
})

export const createRaceJournalEntry = ({
  id,
  userId,
  grandPrix,
  circuitId,
  date,
  weather,
  winner,
  top3 = [],
  raceRating,
  bestOvertake,
  surpriseMoment,
  review,
  driverOfDay,
  notes,
}) => ({
  id,
  userId,
  grandPrix,
  circuitId,
  date,
  weather,
  winner,
  top3,
  raceRating,
  bestOvertake,
  surpriseMoment,
  review,
  driverOfDay,
  notes,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

export const createDriverJournal = ({
  id,
  userId,
  driverId,
  rating,
  bestRacePerformance,
  drivingStyleNotes,
  seasonPerformanceNotes,
  personalComments,
}) => ({
  id,
  userId,
  driverId,
  rating,
  bestRacePerformance,
  drivingStyleNotes,
  seasonPerformanceNotes,
  personalComments,
  updatedAt: new Date().toISOString(),
})

export const createTrackJournal = ({
  id,
  userId,
  trackId,
  rating,
  favoriteCorner,
  hardestSection,
  bestRaceRemembered,
  personalNotes,
}) => ({
  id,
  userId,
  trackId,
  rating,
  favoriteCorner,
  hardestSection,
  bestRaceRemembered,
  personalNotes,
  updatedAt: new Date().toISOString(),
})

export const createFavorite = ({ id, userId, type, referenceId }) => ({
  id,
  userId,
  type,
  referenceId,
  createdAt: new Date().toISOString(),
})
