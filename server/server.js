import { createServer } from 'http'
import { Server } from 'socket.io'
import 'dotenv/config'
import app from './app.js'
import { autoSeed } from './seed/seed.js'
import db from './config/db.js'

// on peuple la DB si elle est vide (premier démarrage ou redéploiement)
await autoSeed()

// Socket.IO a besoin d'un serveur HTTP brut, pas directement d'Express
const httpServer = createServer(app)

// origines autorisées: prod Vercel, dev local Vite, Docker
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost',
].filter(Boolean) // retire les undefined si CLIENT_URL n'est pas défini

const io = new Server(httpServer, {
  cors: { origin: allowedOrigins }
})

// chaque client qui se connecte obtient son propre socket
io.on('connection', (socket) => {
  // username est local à cette connexion, chaque socket a le sien
  let username = null

  // ── Chat ────────────────────────────────────────────────
  socket.on('user:join', (name) => {
    username = name
    // on prévient les autres qu'un nouveau est arrivé (pas l'expéditeur lui-même)
    socket.broadcast.emit('user:joined', { username })
    // on met à jour le compteur pour tout le monde
    io.emit('users:count', io.engine.clientsCount)
  })

  socket.on('message:send', (text) => {
    const timestamp = new Date().toISOString()
    // on diffuse à tout le monde (y compris l'expéditeur pour confirmer)
    io.emit('message:receive', { id: Date.now(), username, text, timestamp })
    // on persiste en DB pour l'historique admin
    db.prepare('INSERT INTO chat_logs (username, text, timestamp) VALUES (?,?,?)').run(username, text, timestamp)
  })

  socket.on('user:typing', (isTyping) => {
    // on envoie l'indicateur de frappe à tout le monde sauf l'expéditeur
    socket.broadcast.emit('typing:update', { username, isTyping })
  })

  socket.on('disconnect', () => {
    // on notifie seulement si le user avait rejoint avec un pseudo
    if (username) {
      socket.broadcast.emit('user:left', { username })
      io.emit('users:count', io.engine.clientsCount)
    }
  })

  // ── Vidéo WebRTC: signalisation ────────────────────────
  // le serveur ne fait que relayer les signaux entre les deux pairs.
  // les flux audio/vidéo transitent directement entre navigateurs.

  socket.on('video:offer', (offer) => {
    // offre SDP envoyée à l'autre pair pour initier l'appel
    socket.broadcast.emit('video:offer', offer)
  })

  socket.on('video:answer', (answer) => {
    // réponse SDP pour confirmer les paramètres de connexion
    socket.broadcast.emit('video:answer', answer)
  })

  socket.on('video:ice-candidate', (candidate) => {
    // candidats ICE pour trouver le meilleur chemin réseau (traversée NAT)
    socket.broadcast.emit('video:ice-candidate', candidate)
  })

  socket.on('video:hang-up', () => {
    socket.broadcast.emit('video:hang-up')
  })

})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
