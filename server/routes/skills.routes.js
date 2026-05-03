import { Router } from 'express'
import { getSkills } from '../controllers/skills.controller.js'

const router = Router()

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Liste des compétences groupées par catégorie
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: Objet groupé par catégorie
 */
router.get('/', getSkills)

export default router