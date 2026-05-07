import { Router } from 'express'
import {
  sendMessage,
  getMessages,
  deleteMessage,
  markRead,
  archiveMessage,
  replyMessage
} from '../controllers/contact.controller.js'
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
 * /api/contact/messages:
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
router.delete('/messages/:id', authMiddleware, deleteMessage)
router.patch('/messages/:id/read', authMiddleware, markRead)
router.patch('/messages/:id/archive', authMiddleware, archiveMessage)
router.patch('/messages/:id/reply', authMiddleware, replyMessage)

export default router
