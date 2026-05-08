import db from '../config/db.js'

export const getChatLogs = (req, res) => {
  res.json(db.prepare('SELECT * FROM chat_logs ORDER BY timestamp DESC').all())
}

export const deleteChatLog = (req, res) => {
  const { id } = req.params
  db.prepare('DELETE FROM chat_logs WHERE id = ?').run(id)
  res.json({ message: 'Message supprimé' })
}

export const clearChatLogs = (req, res) => {
  db.prepare('DELETE FROM chat_logs').run()
  res.json({ message: 'Logs effacés' })
}
