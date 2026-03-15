export const createTeam = ({ id, name, engine, drivers = [], notes = '' }) => ({
  id,
  name,
  engine,
  drivers,
  notes,
})
