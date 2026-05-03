import bcrypt from 'bcrypt'
import db from '../config/db.js'

export async function autoSeed() {
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count
  if (projectCount > 0) return // already seeded

  console.log('Seeding database...')

  const hashed = await bcrypt.hash('admin123', 10)
  db.prepare('INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)').run('admin@portfolio.com', hashed)

  const insertProject = db.prepare('INSERT INTO projects (title, description, tags, github, live, image) VALUES (?,?,?,?,?,?)')
  insertProject.run('Système de Chat en Temps Réel', "Application de chat type mini-WhatsApp avec messagerie instantanée via Socket.IO. Salons de discussion, pseudos, indicateur de frappe et historique des messages en temps réel.", '["Socket.IO","Node.js","Express","React"]', 'https://github.com/PierreDevC/chatapp', 'https://chatapp-tau-liard.vercel.app/', '/chatapp.png')
  insertProject.run('CryptoTrade', "Plateforme de trading de cryptomonnaies sans risque financier, développée en équipe. Données de marché en temps réel, portefeuille virtuel et suivi des transactions.", '["PHP","JavaScript","MySQL"]', 'https://github.com/PierreDevC/cryptotrade', 'https://cryptotrade-production-5b56.up.railway.app/', '/cryptotrade.png')
  insertProject.run('Chat Vidéo en Temps Réel', "Appel vidéo pair-à-pair via WebRTC avec signalisation Socket.IO et contrôles micro/caméra.", '["WebRTC","Socket.IO","PeerJS","React"]', 'https://github.com/PierreDevC/portfolio-projet', null, '/videoconference.png')

  const insertSkill = db.prepare('INSERT INTO skills (name, level, category) VALUES (?,?,?)')
  insertSkill.run('React', 85, 'Frontend')
  insertSkill.run('JavaScript', 80, 'Frontend')
  insertSkill.run('Tailwind CSS', 75, 'Frontend')
  insertSkill.run('HTML / CSS', 90, 'Frontend')
  insertSkill.run('Node.js / Express', 75, 'Backend')
  insertSkill.run('MongoDB', 65, 'Backend')
  insertSkill.run('SQL / SQLite', 70, 'Backend')
  insertSkill.run('REST API', 80, 'Backend')
  insertSkill.run('Git & GitHub', 80, 'Outils')
  insertSkill.run('Docker', 60, 'Outils')
  insertSkill.run('VS Code', 90, 'Outils')
  insertSkill.run('Figma', 55, 'Outils')

  const insertExp = db.prepare('INSERT INTO experiences (type, title, organization, period, description) VALUES (?,?,?,?,?)')
  insertExp.run('formation', "Techniques de l'informatique", 'Collège LaSalle', '2023 — présent', "DEC en techniques de l'informatique, spécialisation développement web full-stack.")
  insertExp.run('emploi', 'Votre poste', 'Votre entreprise', '2022 — 2023', 'Description de vos responsabilités et réalisations.')

  console.log('Seed complete ✓')
}

// Allow running directly: node seed/seed.js
if (process.argv[1].includes('seed.js')) {
  autoSeed().then(() => process.exit(0))
}