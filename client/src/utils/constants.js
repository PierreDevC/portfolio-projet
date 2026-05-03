export const NAV_LINKS = [
    { label: 'À propos', href: '#about' },
    { label: 'Compétences', href: '#skills' },
    { label: 'Projets', href: '#projects' },
    { label: 'Expérience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ]
  
  export const SKILLS = {
    Frontend: [
      { name: 'React', level: 85 },
      { name: 'JavaScript', level: 80 },
      { name: 'Tailwind CSS', level: 75 },
      { name: 'HTML / CSS', level: 90 },
    ],
    Backend: [
      { name: 'Node.js / Express', level: 75 },
      { name: 'MongoDB', level: 65 },
      { name: 'SQL / SQLite', level: 70 },
      { name: 'REST API', level: 80 },
    ],
    Outils: [
      { name: 'Git & GitHub', level: 80 },
      { name: 'Docker', level: 60 },
      { name: 'VS Code', level: 90 },
      { name: 'Figma', level: 55 },
    ],
  }
  
  export const PROJECTS = [
    {
      id: 1,
      title: 'Système de Chat en Temps Réel',
      description: "Application de chat type mini-WhatsApp avec messagerie instantanée via Socket.IO. Salons de discussion, pseudos, indicateur de frappe et historique des messages en temps réel.",
      tags: ['Socket.IO', 'Node.js', 'Express', 'React'],
      github: 'https://github.com/PierreDevC/chatapp',
      live: 'https://chatapp-tau-liard.vercel.app/',
      image: '/chatapp.png',
    },
    {
      id: 2,
      title: 'API REST Professionnelle',
      description: "API REST complète alimentant le portfolio en données dynamiques. Authentification JWT, CRUD complet sur les projets et compétences, documentation Swagger et base de données persistante.",
      tags: ['Express', 'JWT', 'MongoDB', 'Swagger'],
      github: 'https://github.com/PierreDevC/portfolio-projet',
      live: null,
    },
    {
      id: 3,
      title: 'Chat Vidéo en Temps Réel',
      description: "Appel vidéo et audio pair-à-pair intégré au portfolio via WebRTC. Signalisation Socket.IO, contrôles micro/caméra, gestion de la connexion P2P et support STUN.",
      tags: ['WebRTC', 'Socket.IO', 'PeerJS', 'React'],
      github: 'https://github.com/PierreDevC/portfolio-projet',
      live: null,
      image: '/videoconference.png',
    },
  ]
  
  export const EXPERIENCES = [
    {
      id: 1,
      type: 'formation',
      title: "Techniques de l'informatique",
      organization: 'Collège LaSalle',
      period: '2023 — présent',
      description: "DEC en techniques de l'informatique, spécialisation développement web full-stack.",
    },
    {
      id: 2,
      type: 'emploi',
      title: 'Votre poste',
      organization: 'Votre entreprise',
      period: '2022 — 2023',
      description: 'Description de vos responsabilités et réalisations.',
    },
  ]