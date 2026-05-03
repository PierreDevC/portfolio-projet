import db from '../config/db.js'

const parse = (p) => ({ ...p, tags: JSON.parse(p.tags || '[]') })

export const getProjects = (req, res) => {
  res.json(db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all().map(parse))
}

export const getProject = (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id)
  if (!p) return res.status(404).json({ error: 'Projet non trouvé' })
  res.json(parse(p))
}

export const createProject = (req, res) => {
  const { title, description, tags, github, live, image } = req.body
  const r = db.prepare(
    'INSERT INTO projects (title, description, tags, github, live, image) VALUES (?,?,?,?,?,?)'
  ).run(title, description, JSON.stringify(tags || []), github || null, live || null, image || null)
  res.status(201).json({ id: r.lastInsertRowid, title, description, tags, github, live, image })
}

export const updateProject = (req, res) => {
  const { title, description, tags, github, live, image } = req.body
  const r = db.prepare(
    'UPDATE projects SET title=?,description=?,tags=?,github=?,live=?,image=? WHERE id=?'
  ).run(title, description, JSON.stringify(tags || []), github || null, live || null, image || null, req.params.id)
  if (r.changes === 0) return res.status(404).json({ error: 'Projet non trouvé' })
  res.json({ id: Number(req.params.id), title, description, tags, github, live, image })
}

export const deleteProject = (req, res) => {
  const r = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id)
  if (r.changes === 0) return res.status(404).json({ error: 'Projet non trouvé' })
  res.json({ message: 'Projet supprimé' })
}