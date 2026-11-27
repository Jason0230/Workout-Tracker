# Workout Tracker

A full-stack workout tracking web application for logging exercises, sets, and training progress, built with React, Express, Prisma, and MySQL.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://workout-tracker-web-app.vercel.app)
[![Backend](https://img.shields.io/badge/API-Railway-0B0D0E?style=for-the-badge&logo=railway)](https://railway.app)

**Live App:** [https://workout-tracker-web-app.vercel.app](https://workout-tracker-web-app.vercel.app)

---

## Screenshots

<!-- Add screenshots to a /docs folder in your repo and update these paths -->
| Login / Demo Access | Workout Dashboard | Active Workout Logger |
| :---: | :---: | :---: |
| ![Login](./docs/login.png) | ![Dashboard](./docs/dashboard.png) | ![Workout](./docs/workout.png) |

---

## Features

- **Secure Authentication:** User registration and login using JWT access tokens and HTTP-only refresh token cookies with automatic session refresh.
- **One-Click Demo Account:** Instant demo login so visitors can test the app without creating an account.
- **Workout Management:** Create, view, edit, and delete full workout sessions.
- **Exercise & Set Tracking:** Add exercises from a pre-seeded exercise library and log individual sets, reps, and weights.
- **Persistent Cloud Database:** Relational MySQL schema managed with Prisma ORM.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, React Router |
| **Backend** | Node.js, Express.js |
| **ORM & Database** | Prisma ORM, MySQL |
| **Authentication** | JSON Web Tokens (JWT), HTTP-only Cookies, `cookie-parser` |
| **Hosting** | Vercel (Frontend), Railway (Backend API & MySQL Database) |

---

## Project Structure

```text
workout-tracker/
├── frontend/                  # React + Vite client
│   ├── src/                   # Components, pages, hooks, API utilities
│   ├── vercel.json            # SPA rewrite rules for client-side routing
│   ├── .env.example           # Frontend environment variable template
│   └── package.json
├── backend/                   # Express + Prisma REST API
│   ├── config/                # Database connection setup
│   ├── middleware/            # JWT validation & centralized error handling
│   ├── prisma/                # schema.prisma, migrations, and seed.js
│   ├── routes/                # API route handlers (user, workout, exercise, set)
│   ├── server.js              # Express entry point
│   ├── .env.example           # Backend environment variable template
│   └── package.json
├── docs/                      # Screenshots for README
├── .gitignore
└── README.md
```

---

## API Endpoints

All API routes are prefixed with `/api`. Protected routes require a valid JWT access token.

| Resource | Base Route | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| **Users & Auth** | `/api/user` | Mixed | Register, login, demo login (`/demo`), token refresh (`/refresh`), logout |
| **Workouts** | `/api/workout` | Yes | Create, list, update, and delete workouts |
| **Exercises** | `/api/exercise` | Yes | Fetch pre-seeded exercises and manage custom exercises |
| **Workout Sets** | `/api/workout-exercise/:workoutExerciseId/set` | Yes | Add or list sets for a specific exercise in a workout |
| **Sets by ID** | `/api/set` | Yes | Update or delete individual sets |

---

## Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MySQL](https://dev.mysql.com/downloads/) running locally

### 1. Clone the Repository
```bash
git clone [https://github.com/](https://github.com/)<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Update `backend/.env` with your local MySQL credentials and JWT secrets, then sync the database and seed the exercise library:
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
npm start
```
The API will run at `http://localhost:{PORT}` where PORT is the value of the PORT env variable you set earlier.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
cp .env.example .env
```
Ensure `frontend/.env` points to your local backend (`VITE_API_URL=http://localhost:{PORT}/api`), then start the dev server:
```bash
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | MySQL connection string | `mysql://root:password@localhost:3306/workout_tracker` |
| `PORT` | Port the Express server listens on | `5200` |
| `FRONTEND_URL` | Allowed CORS origin (no trailing slash) | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for signing access tokens | `your_access_secret` |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | `your_refresh_secret` |
| `NODE_ENV` | Runtime environment | `development` or `production` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for backend API requests | `http://localhost:5200/api` |

---

## License

This project is licensed under the MIT License.
