import { Router } from 'express'
import { getChatLogs, deleteChatLog, clearChatLogs } from '../controllers/chat.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/logs', authMiddleware, getChatLogs)
router.delete('/logs/:id', authMiddleware, deleteChatLog)
router.delete('/logs', authMiddleware, clearChatLogs)

export default router
