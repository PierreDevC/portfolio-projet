import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// nécessaire en ESM pour reconstruire __dirname (pas dispo nativement)
const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, '../portfolio.db'))

// WAL = meilleure perf en lectures/écritures simultanées
db.pragma('journal_mode = WAL')
// active les contraintes de clé étrangère (désactivées par défaut dans SQLite)
db.pragma('foreign_keys = ON')

db.exec(`
  -- compte admin uniquement (un seul en pratique)
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    email    TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  -- projets affichés dans le portfolio
  CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT,
    tags        TEXT DEFAULT '[]',
    github      TEXT,
    live        TEXT,
    image       TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- compétences avec niveau (0-100) et catégorie pour le regroupement
  CREATE TABLE IF NOT EXISTS skills (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL,
    level    INTEGER NOT NULL,
    category TEXT NOT NULL
  );

  -- parcours pro et académique (type = 'emploi' ou 'formation')
  CREATE TABLE IF NOT EXISTS experiences (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    type         TEXT NOT NULL,
    title        TEXT NOT NULL,
    organization TEXT NOT NULL,
    period       TEXT NOT NULL,
    description  TEXT
  );

  -- messages reçus via le formulaire de contact
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- historique persistant du chat en direct
  CREATE TABLE IF NOT EXISTS chat_logs (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT NOT NULL,
    text      TEXT NOT NULL,
    timestamp DATETIME NOT NULL
  );
`)

// migrations idempotentes: ALTER TABLE échoue silencieusement si la colonne existe déjà,
// ce qui permet de les rejouer sans risque sur une DB existante
try { db.exec('ALTER TABLE messages ADD COLUMN read INTEGER DEFAULT 0') } catch {}
try { db.exec('ALTER TABLE messages ADD COLUMN archived INTEGER DEFAULT 0') } catch {}
try { db.exec('ALTER TABLE messages ADD COLUMN reply TEXT') } catch {}

export default db
