import { Router } from 'express'
import { login } from '../controllers/auth.controller.js'

const router = Router()

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion administrateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Token JWT
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', login)

export default router