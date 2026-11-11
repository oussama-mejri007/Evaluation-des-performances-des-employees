# Système d'Évaluation des Performances des Employés

> Plateforme RH intelligente développée dans le cadre d'un stage, combinant une API REST sécurisée (NestJS) avec une interface moderne (Next.js) et des recommandations alimentées par l'IA (Groq).

---

## ✨ Fonctionnalités

| Domaine | Fonctionnalités |
|---|---|
| 👥 **Employés & Postes** | CRUD employés, départements, postes, compétences |
| 🎯 **Objectifs** | Création et suivi des objectifs individuels |
| 📊 **Évaluations** | Campagnes d'évaluation, grilles de notation |
| 🤖 **IA Groq** | Recommandations de formations et d'évolutions de carrière |
| 💬 **Chat IA** | Interface de conversation avec l'assistant RH |
| 🔐 **Sécurité** | Authentification JWT, hachage bcrypt, rôles (Admin / RH / Employé) |

---

## 🏗️ Architecture

```
mon-projet-stage/
├── frontend/              # Next.js 14 (App Router, TypeScript, Tailwind CSS)
│   └── app/
│       ├── (dashboard)/   # Pages protégées
│       ├── login/         # Authentification
│       └── register/
├── nestjs-app-course/     # API REST NestJS + TypeORM + PostgreSQL
│   ├── src/
│   │   ├── auth/          # JWT Strategy, Guard, bcrypt
│   │   ├── employee/
│   │   ├── evaluation/
│   │   ├── career-recommandation/   # IA Groq
│   │   ├── training-recommandation/ # IA Groq
│   │   └── chat-*/        # Conversations IA
│   └── prisma/
└── docker-compose.yml
```

---

## 🚀 Lancement rapide avec Docker

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et en cours d'exécution

### 1. Cloner le dépôt
```bash
git clone https://github.com/oussama-mejri007/Evaluation-des-performances-des-employees.git
cd Evaluation-des-performances-des-employees
```

### 2. Configurer les variables d'environnement
```bash
# Backend
cp nestjs-app-course/.env.example nestjs-app-course/.env

# Frontend
cp frontend/.env.local.example frontend/.env.local
```

Éditez `nestjs-app-course/.env` et renseignez au minimum :
- `DB_PASSWORD` — mot de passe PostgreSQL
- `JWT_SECRET` — chaîne aléatoire longue (min. 32 caractères)
- `GROQ_API_KEY` — clé obtenue sur [console.groq.com](https://console.groq.com)

### 3. Lancer l'application
```bash
docker compose up --build
```

| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **API (Swagger)** | http://localhost:3001/api |
| **PostgreSQL** | localhost:5432 |

---

## 🛠️ Lancement manuel (sans Docker)

### Prérequis
- Node.js ≥ 18
- PostgreSQL 14+
- npm

### Backend
```bash
cd nestjs-app-course

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# → Éditez .env avec vos paramètres

# Lancer en mode développement
npm run start:dev
```
> L'API écoute sur **http://localhost:3001**

### Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.local.example .env.local

# Lancer en mode développement
npm run dev
```
> L'application est disponible sur **http://localhost:3000**

---

## 📸 Captures d'écran

> *À ajouter — placez vos captures dans `docs/screenshots/` et mettez à jour les liens ci-dessous.*

| Dashboard | Évaluations | Chat IA |
|:---:|:---:|:---:|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Évaluations](docs/screenshots/evaluations.png) | ![Chat IA](docs/screenshots/chat.png) |

---

## 🔐 Sécurité

- **Mots de passe** hachés avec `bcrypt` (salt rounds = 10)
- **Authentification** par token JWT (expiration 24 h)
- **Variables sensibles** lues depuis des fichiers `.env` (jamais commitées)
- **Synchronisation DB** désactivée automatiquement en production (`NODE_ENV=production`)
- **Rôles** : `ADMIN`, `HR`, `EMPLOYEE` — contrôle d'accès par Guard NestJS

---

## 🧰 Stack technique

| Couche | Technologie |
|---|---|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | NestJS, TypeScript, TypeORM |
| **Base de données** | PostgreSQL |
| **Auth** | Passport.js, JWT, bcrypt |
| **IA** | Groq API (LLM) |
| **ORM / Migration** | Prisma (schéma), TypeORM (runtime) |
| **Conteneurisation** | Docker, Docker Compose |

---

## 📄 Licence

Projet de stage — tous droits réservés.
