import db from '../config/db.js'

export const sendMessage = (req, res) => {
  const { name, email, message } = req.body
  db.prepare('INSERT INTO messages (name, email, message) VALUES (?,?,?)').run(name, email, message)
  res.status(201).json({ message: 'Message envoyé avec succès' })
}

export const getMessages = (req, res) => {
  res.json(db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all())
}

export const deleteMessage = (req, res) => {
  const { id } = req.params
  db.prepare('DELETE FROM messages WHERE id = ?').run(id)
  res.json({ message: 'Message supprimé' })
}

export const markRead = (req, res) => {
  const { id } = req.params
  const { read } = req.body
  db.prepare('UPDATE messages SET read = ? WHERE id = ?').run(read ? 1 : 0, id)
  res.json({ message: 'Statut mis à jour' })
}

export const archiveMessage = (req, res) => {
  const { id } = req.params
  const { archived } = req.body
  db.prepare('UPDATE messages SET archived = ? WHERE id = ?').run(archived ? 1 : 0, id)
  res.json({ message: 'Statut archivage mis à jour' })
}

export const replyMessage = (req, res) => {
  const { id } = req.params
  const { reply } = req.body
  db.prepare('UPDATE messages SET reply = ? WHERE id = ?').run(reply, id)
  res.json({ message: 'Réponse enregistrée' })
}
