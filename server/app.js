import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import authRoutes from './routes/auth.routes.js'
import projectsRoutes from './routes/projects.routes.js'
import skillsRoutes from './routes/skills.routes.js'
import experiencesRoutes from './routes/experiences.routes.js'
import contactRoutes from './routes/contact.routes.js'
import chatRoutes from './routes/chat.routes.js'
import { errorMiddleware } from './middleware/error.middleware.js'

const app = express()

// origines autorisées : prod (Vercel), dev (Vite), Docker (nginx)
// filter(Boolean) retire les entrées undefined si CLIENT_URL n'est pas défini
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost',
].filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

// doc Swagger auto-générée depuis les commentaires JSDoc des routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// routes de l'API
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/experiences', experiencesRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/chat', chatRoutes)

// endpoint simple pour vérifier que le serveur répond (utile pour Render/monitoring)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// middleware d'erreur global — doit être en dernier
app.use(errorMiddleware)

export default app
