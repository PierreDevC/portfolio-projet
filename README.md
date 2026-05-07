# Portfolio Professionnel - Pierre C.

Projet final du cours Tendance Technologiques
Portfolio full-stack construit en 4 étapes progressives avec React, Node.js, Socket.IO, WebRTC et Docker.

🔗 **Live** → [portfolio-projet-zeta.vercel.app](https://portfolio-projet-zeta.vercel.app)

---

## Stack

| Couche | Technologies |
|--------|-------------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js 20, Express 5, SQLite (better-sqlite3) |
| Temps réel | Socket.IO (chat + signalisation WebRTC) |
| Vidéo P2P | WebRTC natif (RTCPeerConnection + STUN Google) |
| Auth | JWT + bcrypt |
| Docs API | Swagger UI `/api/docs` |
| Conteneurisation | Docker + Docker Compose |
| Déploiement | Vercel (frontend) + Render (backend) |

---

## Étapes du projet

| Étape | Description | Status |
|-------|-------------|--------|
| 1 | Portfolio React + Tailwind + animations Framer Motion | ✅ |
| 2 | Chat temps réel avec Socket.IO | ✅ |
| 3 | API REST + JWT + CRUD + Swagger | ✅ |
| 4 | Vidéo/audio WebRTC pair-à-pair | ✅ |

---

## Lancer en local (Docker)

```bash
git clone https://github.com/PierreDevC/portfolio-projet.git
cd portfolio-projet
docker-compose up --build
```

Ouvre `http://localhost` dans ton navigateur.

---

## Lancer en développement

```bash
# Serveur (http://localhost:3001)
cd server && npm install && npm run dev

# Client (http://localhost:5173)
cd client && npm install && npm run dev
```

Variables d'environnement requises dans `server/.env` :
```
JWT_SECRET=...
CLIENT_URL=http://localhost:5173
```

---

## Déploiement

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://portfolio-projet-zeta.vercel.app |
| Backend (Render) | https://portfolio-api-dleh.onrender.com |
| API Docs (Swagger) | https://portfolio-api-dleh.onrender.com/api/docs |
