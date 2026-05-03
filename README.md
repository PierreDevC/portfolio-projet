# Portfolio Professionnel & Communication Temps Réel

Projet final du cours 420-TT4-AS — Collège LaSalle.  
Portfolio full-stack construit en 4 étapes avec React, Node.js, Socket.IO, WebRTC et Docker.

## Stack

| Couche | Technologies |
|--------|-------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router v6, Framer Motion |
| Backend | Node.js 20, Express 5, Socket.IO |
| Temps réel (vidéo) | WebRTC (étape 4) |
| Conteneurisation | Docker, Docker Compose |

## Structure

```
portfolio-projet/
├── client/       # React + Vite + Tailwind
├── server/       # Express + Socket.IO
├── docker-compose.yml
└── .env.example
```

## Installation

### Prérequis
- Node.js 20+
- Docker + Docker Compose

### Développement local

```bash
# Client (http://localhost:5173)
cd client
npm install
npm run dev

# Serveur (http://localhost:3001)
cd server
npm install
npm run dev
```

### Variables d'environnement

Copier `.env.example` et créer un `.env` à la racine :

```bash
cp .env.example .env
```

Créer aussi `client/.env` pour EmailJS :

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Docker

```bash
docker-compose up --build
```

Le portfolio sera accessible sur `http://localhost`.

## Étapes du projet

| Étape | Description | Status |
|-------|-------------|--------|
| 1 | Portfolio React + Tailwind + Déploiement Vercel | ✅ En cours |
| 2 | Chat temps réel avec Socket.IO | ⬜ À faire |
| 3 | API REST + JWT + Swagger | ⬜ À faire |
| 4 | Vidéo WebRTC | ⬜ À faire |

## Déploiement

| Service | URL |
|---------|-----|
| Frontend (Vercel) | _à compléter_ |
| Backend (Render) | _à compléter_ |
| API Docs (Swagger) | _à compléter_ |
