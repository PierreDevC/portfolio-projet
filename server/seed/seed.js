import bcrypt from 'bcrypt'
import db from '../config/db.js'

// Admin user
const hashed = await bcrypt.hash('admin123', 10)
db.prepare('INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)').run('admin@portfolio.com', hashed)

// Projects
const insertProject = db.prepare('INSERT OR IGNORE INTO projects (id, title, description, tags, github, live, image) VALUES (?,?,?,?,?,?,?)')
insertProject.run(1, 'Système de Chat en Temps Réel', "Application de chat type mini-WhatsApp avec messagerie instantanée via Socket.IO.", '["Socket.IO","Node.js","Express","React"]', 'https://github.com/PierreDevC/chatapp', 'https://chatapp-tau-liard.vercel.app/', '/chatapp.png')
insertProject.run(2, 'API REST Professionnelle', "API REST complète avec authentification JWT, CRUD complet et documentation Swagger.", '["Express","JWT","SQLite","Swagger"]', 'https://github.com/PierreDevC/portfolio-projet', null, null)
insertProject.run(3, 'Chat Vidéo en Temps Réel', "Appel vidéo pair-à-pair via WebRTC avec signalisation Socket.IO et contrôles micro/caméra.", '["WebRTC","Socket.IO","PeerJS","React"]', 'https://github.com/PierreDevC/portfolio-projet', null, '/videoconference.png')

// Skills
const insertSkill = db.prepare('INSERT OR IGNORE INTO skills (id, name, level, category) VALUES (?,?,?,?)')
insertSkill.run(1, 'React', 85, 'Frontend')
insertSkill.run(2, 'JavaScript', 80, 'Frontend')
insertSkill.run(3, 'Tailwind CSS', 75, 'Frontend')
insertSkill.run(4, 'HTML / CSS', 90, 'Frontend')
insertSkill.run(5, 'Node.js / Express', 75, 'Backend')
insertSkill.run(6, 'MongoDB', 65, 'Backend')
insertSkill.run(7, 'SQL / SQLite', 70, 'Backend')
insertSkill.run(8, 'REST API', 80, 'Backend')
insertSkill.run(9, 'Git & GitHub', 80, 'Outils')
insertSkill.run(10, 'Docker', 60, 'Outils')
insertSkill.run(11, 'VS Code', 90, 'Outils')
insertSkill.run(12, 'Figma', 55, 'Outils')

// Experiences
const insertExp = db.prepare('INSERT OR IGNORE INTO experiences (id, type, title, organization, period, description) VALUES (?,?,?,?,?,?)')
insertExp.run(1, 'formation', "Techniques de l'informatique", 'Collège LaSalle', '2023 — présent', "DEC en techniques de l'informatique, spécialisation développement web full-stack.")
insertExp.run(2, 'emploi', 'Votre poste', 'Votre entreprise', '2022 — 2023', 'Description de vos responsabilités et réalisations.')

console.log('Seed terminé ✓')
console.log('Admin: admin@portfolio.com / admin123')
process.exit(0)