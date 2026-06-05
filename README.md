# Karigori

Karigori is a Dhaka-focused local service marketplace where customers can discover, filter, review, and contact verified service professionals. The app includes public browsing, worker registration, worker profile management, client accounts, admin approval tools, document upload flows, and review/report features.

## Live Deployment Plan

- Frontend: Vercel
- Backend API: Render
- Database: MongoDB Atlas

The frontend is built from `client/`. The backend is built from `server/`.

## Features

- Browse workers by service category, area, availability, and verification status
- Worker profile pages with contact actions and reviews
- User registration and login for clients and workers
- Worker dashboard for profile updates, photo uploads, and document uploads
- Admin dashboard for approvals, rejection notes, flags, client lists, and stats
- JWT authentication
- MongoDB Atlas storage through Mongoose
- Demo seed data for testing the deployed app

## Tech Stack

- React 18
- Vite
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Multer
- Tailwind CSS

## Project Structure

```text
karigori/
  client/          React + Vite frontend
  server/          Express + Mongoose backend
  render.yaml      Render backend blueprint
  vercel.json      Vercel frontend build config
  package.json     Root scripts for local development
```

## Local Setup

Install dependencies:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

Create `server/.env`:

```bash
PORT=5000
MONGO_URI=mongodb+srv://YOUR_ATLAS_USER:YOUR_ATLAS_PASSWORD@YOUR_CLUSTER.mongodb.net/karigori?appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
```

Create `client/.env`:

```bash
VITE_API_URL=http://localhost:5000
```

Run both apps:

```bash
npm run dev
```

Open:

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:5000/api/health`

## Demo Data

The seed script creates test workers, reviews, and an admin account.

```bash
cd server
npm run seed
```

Seeded admin login:

```text
Email: admin@karigori.com
Password: admin123
```

Important: the seed script clears existing worker and review records before inserting demo data. Use it for testing or demo databases, not for a production database with real users.

## Render Backend Deployment

Deploy the backend using Render from this GitHub repository. The included `render.yaml` configures Render to use the `server` directory.

Render environment variables:

```bash
NODE_ENV=production
MONGO_URI=your MongoDB Atlas connection string
JWT_SECRET=a long random secret
CLIENT_URL=https://your-vercel-app.vercel.app
```

Render build command:

```bash
npm install
```

Render start command:

```bash
npm start
```

After deployment, verify:

```text
https://your-render-service.onrender.com/api/health
```

## Vercel Frontend Deployment

Deploy the frontend using Vercel from this GitHub repository. The included `vercel.json` builds the Vite app from `client/`.

Vercel environment variable:

```bash
VITE_API_URL=https://your-render-service.onrender.com
```

After the final Vercel URL is created, update Render's `CLIENT_URL` value to that exact Vercel URL and redeploy the backend.

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Backend health check |
| GET | `/api/workers` | List approved workers |
| GET | `/api/workers/:id` | Worker profile |
| GET | `/api/workers/:id/reviews` | Worker reviews |
| POST | `/api/workers/:id/reviews` | Add a review |
| POST | `/api/workers/:id/report` | Report a worker |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/profile/worker` | Worker dashboard profile |
| PUT | `/api/profile/worker` | Update worker profile |
| GET | `/api/profile/client` | Client dashboard profile |
| GET | `/api/admin/stats` | Admin stats |
| GET | `/api/admin/workers` | Admin worker moderation list |
| GET | `/api/admin/clients` | Admin client list |

## Security Notes

- Do not commit `server/.env`, `client/.env`, MongoDB credentials, JWT secrets, or uploaded identity documents.
- Store `MONGO_URI` and `JWT_SECRET` in Render environment variables.
- Store `VITE_API_URL` in Vercel environment variables.
- Rotate any database password that has been shared publicly or in chat.
- Uploaded files in `server/uploads` are ignored by Git.

## Repository

GitHub: https://github.com/aialamin/karigori.org
