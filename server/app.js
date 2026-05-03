import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import authRoutes from './routes/auth.routes.js'
import projectsRoutes from './routes/projects.routes.js'
import skillsRoutes from './routes/skills.routes.js'
import experiencesRoutes from './routes/experiences.routes.js'
import contactRoutes from './routes/contact.routes.js'
import { errorMiddleware } from './middleware/error.middleware.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/skills', skillsRoutes)
app.use('/api/experiences', experiencesRoutes)
app.use('/api/contact', contactRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use(errorMiddleware)

export default app