import { createServer } from 'http'
import { Server } from 'socket.io'
import 'dotenv/config'
import app from './app.js'
import { autoSeed } from './seed/seed.js'


await autoSeed()

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' }
})

//
// user se connecte
io.on('connection', (socket) => {
  let username = null

  // Chat
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


  // Video chat
  socket.on('video:offer', (offer) => {
    socket.broadcast.emit('video:offer', offer)
  })

  socket.on('video:answer', (answer) => {
    socket.broadcast.emit('video:answer', answer)
  })

  socket.on('video:ice-candidate', (candidate) => {
    socket.broadcast.emit('video:ice-candidate', candidate)
  })

  socket.on('video:hang-up', () => {
    socket.broadcast.emit('video:hang-up')
  })

})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));