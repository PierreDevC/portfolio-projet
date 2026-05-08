import db from '../config/db.js'

// retourne tout l'historique, du plus récent au plus ancien (pour l'admin)
export const getChatLogs = (req, res) => {
  res.json(db.prepare('SELECT * FROM chat_logs ORDER BY timestamp DESC').all())
}

// supprime un seul message du log
export const deleteChatLog = (req, res) => {
  const { id } = req.params
  db.prepare('DELETE FROM chat_logs WHERE id = ?').run(id)
  res.json({ message: 'Message supprimé' })
}

// vide tout l'historique d'un coup — action irréversible côté admin
export const clearChatLogs = (req, res) => {
  db.prepare('DELETE FROM chat_logs').run()
  res.json({ message: 'Logs effacés' })
}
