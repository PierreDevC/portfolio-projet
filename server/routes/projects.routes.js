import { Router } from 'express'
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projects.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Liste des projets
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Tableau de projets
 */
router.get('/', getProjects)

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Un projet spécifique
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Projet trouvé
 *       404:
 *         description: Non trouvé
 */
router.get('/:id', getProject)

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Créer un projet (admin)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Projet créé
 */
router.post('/', authMiddleware, createProject)
router.put('/:id', authMiddleware, updateProject)
router.delete('/:id', authMiddleware, deleteProject)

export default router