import { Router } from 'express'
import { sendMessage, getMessages } from '../controllers/contact.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Envoyer un message de contact
 *     tags: [Contact]
 *     responses:
 *       201:
 *         description: Message reçu
 */
router.post('/', sendMessage)

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Lire les messages (admin)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des messages
 */
router.get('/messages', authMiddleware, getMessages)

export default router