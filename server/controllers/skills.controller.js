import db from '../config/db.js'

export const getSkills = (req, res) => {
  const rows = db.prepare('SELECT * FROM skills ORDER BY category, name').all()
  const grouped = rows.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push({ id: s.id, name: s.name, level: s.level })
    return acc
  }, {})
  res.json(grouped)
}