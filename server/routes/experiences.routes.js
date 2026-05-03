import { Router } from 'express'
import { getExperiences } from '../controllers/experiences.controller.js'

const router = Router()

/**
 * @swagger
 * /api/experiences:
 *   get:
 *     summary: Liste des expériences et formations
 *     tags: [Experiences]
 *     responses:
 *       200:
 *         description: Tableau d'expériences
 */
router.get('/', getExperiences)

export default router