import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
  // l'en-tête attendu : "Authorization: Bearer <token>"
  // split(' ')[1] retire le préfixe "Bearer " pour garder juste le token
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Token manquant' })

  try {
    // vérifie la signature et la date d'expiration en même temps
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    // token invalide, falsifié ou expiré
    res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}
