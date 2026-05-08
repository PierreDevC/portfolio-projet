import bcrypt from 'bcrypt'
import db from '../config/db.js'

export async function autoSeed() {
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count
  if (projectCount > 0) return // already seeded

  console.log('Seeding database...')

  const hashed = await bcrypt.hash('admin123', 10)
  db.prepare('INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)').run('admin@portfolio.com', hashed)

  // ── Projects ────────────────────────────────────────────────
  const insertProject = db.prepare('INSERT INTO projects (title, description, tags, github, live, image) VALUES (?,?,?,?,?,?)')

  insertProject.run(
    'MortWise',
    "Application mobile multiplateforme bilingue (EN/FR) de planification hypothécaire avec 4 outils interconnectés : pré-qualification, calculateur hypothécaire, simulateur de scénarios et calculateur CELIAPP. Intègre un agent conversationnel propulsé par l'IA.",
    '["Flutter","Dart","Firebase","Provider"]',
    null,
    'https://mortwise.web.app/',
    null
  )

  insertProject.run(
    'Calendapp',
    "Application de calendrier collaboratif prête pour la production supportant plus de 50 utilisateurs simultanés, avec authentification JWT, calendriers d'équipe en temps réel et permissions basées sur les rôles. Pipeline CI/CD via GitHub Actions.",
    '["Next.js","Spring Boot","Java","PostgreSQL"]',
    null,
    'https://mina-scheduler-delta.vercel.app/',
    null
  )

  insertProject.run(
    'Système de Chat en Temps Réel',
    "Application de chat instantané via Socket.IO avec pseudos, indicateur de frappe en temps réel et compteur d'utilisateurs connectés.",
    '["Socket.IO","Node.js","Express","React"]',
    'https://github.com/PierreDevC/chatapp',
    'https://chatapp-tau-liard.vercel.app/',
    '/chatapp.png'
  )

  insertProject.run(
    'CryptoTrade',
    "Plateforme de trading de cryptomonnaies simulée développée en équipe. Données de marché en temps réel, portefeuille virtuel et suivi des transactions. Requêtes MySQL optimisées réduisant le temps de réponse de 55 %.",
    '["PHP","JavaScript","MySQL","Apache"]',
    'https://github.com/PierreDevC/cryptotrade',
    'https://cryptotrade-production-5b56.up.railway.app/',
    '/cryptotrade.png'
  )

  insertProject.run(
    'Chat Vidéo en Temps Réel',
    "Appel vidéo pair-à-pair via WebRTC avec signalisation Socket.IO, contrôles micro/caméra et interface de portfolio intégrée.",
    '["WebRTC","Socket.IO","React","Node.js"]',
    'https://github.com/PierreDevC/portfolio-projet',
    null,
    '/videoconference.png'
  )

  // ── Skills ──────────────────────────────────────────────────
  const insertSkill = db.prepare('INSERT INTO skills (name, level, category) VALUES (?,?,?)')

  // Frontend
  insertSkill.run('HTML / CSS',    90, 'Frontend')
  insertSkill.run('JavaScript',    85, 'Frontend')
  insertSkill.run('React',         85, 'Frontend')
  insertSkill.run('Next.js',       75, 'Frontend')
  insertSkill.run('Tailwind CSS',  80, 'Frontend')

  // Backend
  insertSkill.run('Node.js / Express', 80, 'Backend')
  insertSkill.run('Java / Spring Boot', 70, 'Backend')
  insertSkill.run('PHP',               65, 'Backend')
  insertSkill.run('Python',            60, 'Backend')
  insertSkill.run('SQL',               80, 'Backend')
  insertSkill.run('REST APIs',         85, 'Backend')
  insertSkill.run('Firebase',          70, 'Backend')

  // Mobile
  insertSkill.run('Flutter / Dart', 75, 'Mobile')
  insertSkill.run('Swift',          50, 'Mobile')

  // Outils
  insertSkill.run('Git / GitHub', 85, 'Outils')
  insertSkill.run('Docker',       70, 'Outils')
  insertSkill.run('CI/CD',        65, 'Outils')
  insertSkill.run('AWS',          55, 'Outils')
  insertSkill.run('Figma',        80, 'Outils')
  insertSkill.run('Photoshop',    70, 'Outils')

  // ── Experiences ─────────────────────────────────────────────
  const insertExp = db.prepare('INSERT INTO experiences (type, title, organization, period, description) VALUES (?,?,?,?,?)')

  insertExp.run(
    'emploi',
    'Spécialiste, relations clients hypothécaires',
    'First National Financial',
    'Mai 2025 — Août 2025',
    "Gestion hypothécaire de bout en bout pour un portefeuille de clients résidentiels à travers le Canada. Traitement de demandes de décharge et de transfert impliquant des transactions de 200 000 $ à 800 000 $+. Taux de résolution au premier appel de 95 % et score de satisfaction client de 98 %."
  )

  insertExp.run(
    'emploi',
    'Spécialiste marketing (stage)',
    'Marketing & Media International Group, Inc.',
    'Mai 2024 — Août 2024',
    "Développement et maintenance de sites WordPress, optimisant la performance et le design UI/UX (+15 % de rétention). Production de contenu pour un public international de plus de 5 000 abonnés dans 20+ pays. Augmentation de l'engagement sur les réseaux sociaux de 35 % via des campagnes de marketing numérique ciblées."
  )

  insertExp.run(
    'formation',
    "DEC — Techniques de l'informatique : Programmation",
    'Collège LaSalle Montréal',
    'Août 2023 — Mai 2026',
    "Diplôme d'études collégiales en techniques de l'informatique, spécialisation développement web et mobile full-stack."
  )

  insertExp.run(
    'formation',
    'AEC — Design graphique',
    'Collège LaSalle Montréal',
    'Janvier 2022 — Mai 2023',
    "Attestation d'études collégiales en design graphique. Maîtrise des outils Adobe (Photoshop, Illustrator, InDesign) et des principes UI/UX."
  )

  console.log('Seed complete ✓')
}

// Allow running directly: node seed/seed.js
if (process.argv[1].includes('seed.js')) {
  autoSeed().then(() => process.exit(0))
}
