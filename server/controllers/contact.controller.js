import db from '../config/db.js'

// formulaire de contact public — tout le monde peut envoyer
export const sendMessage = (req, res) => {
  const { name, email, message } = req.body
  db.prepare('INSERT INTO messages (name, email, message) VALUES (?,?,?)').run(name, email, message)
  res.status(201).json({ message: 'Message envoyé avec succès' })
}

// récupère tous les messages, du plus récent au plus ancien
export const getMessages = (req, res) => {
  res.json(db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all())
}

// suppression définitive d'un message
export const deleteMessage = (req, res) => {
  const { id } = req.params
  db.prepare('DELETE FROM messages WHERE id = ?').run(id)
  res.json({ message: 'Message supprimé' })
}

// bascule lu/non lu (SQLite stocke les booléens en 0/1)
export const markRead = (req, res) => {
  const { id } = req.params
  const { read } = req.body
  db.prepare('UPDATE messages SET read = ? WHERE id = ?').run(read ? 1 : 0, id)
  res.json({ message: 'Statut mis à jour' })
}

// archivage soft: le message reste en DB mais est masqué dans la vue principale
export const archiveMessage = (req, res) => {
  const { id } = req.params
  const { archived } = req.body
  db.prepare('UPDATE messages SET archived = ? WHERE id = ?').run(archived ? 1 : 0, id)
  res.json({ message: 'Statut archivage mis à jour' })
}

// sauvegarde la réponse de l'admin directement sur le message (pas d'envoi d'email)
export const replyMessage = (req, res) => {
  const { id } = req.params
  const { reply } = req.body
  db.prepare('UPDATE messages SET reply = ? WHERE id = ?').run(reply, id)
  res.json({ message: 'Réponse enregistrée' })
}
