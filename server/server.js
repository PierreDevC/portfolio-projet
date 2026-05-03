import { createServer } from 'http'
import { Server } from 'socket.io'
import 'dotenv/config'
import app from './app.js'

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' }
})

// user se connecte
io.on('connection', (socket) => {
  let username = null

  socket.on('user:join', (name) => {
    username = name
    socket.broadcast.emit('user:joined', { username })
    io.emit('users:count', io.engine.clientsCount)
  })

  // envoi de message
  socket.on('message:send', (text) => {
    io.emit('message:receive', {
      id: Date.now(), username, text, timestamp: new Date().toISOString()
    })
  })

  // mettre à jour quand le user est en trai d'écrire
  socket.on('user:typing', (isTyping) => {
    socket.broadcast.emit('typing:update', { username, isTyping })
  })

  // se déconnecter
  socket.on('disconnect', () => {
    if (username) {
      socket.broadcast.emit('user:left', { username })
      io.emit('users:count', io.engine.clientsCount) // le nombre d'utilisateurs
    }
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))