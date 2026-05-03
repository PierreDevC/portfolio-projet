import db from '../config/db.js'

export const sendMessage = (req, res) => {
  const { name, email, message } = req.body
  db.prepare('INSERT INTO messages (name, email, message) VALUES (?,?,?)').run(name, email, message)
  res.status(201).json({ message: 'Message envoyé avec succès' })
}

export const getMessages = (req, res) => {
  res.json(db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all())
}