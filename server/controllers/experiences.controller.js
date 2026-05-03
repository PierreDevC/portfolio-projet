import db from '../config/db.js'

export const getExperiences = (req, res) => {
  res.json(db.prepare('SELECT * FROM experiences ORDER BY id DESC').all())
}