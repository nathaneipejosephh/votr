# VOTR Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Database Setup

Make sure PostgreSQL is running, then create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE votr_db;

# Exit psql
\q
```

## Step 2: Start the Backend

```bash
cd ~/Documents/votr-app/backend

# Install dependencies (first time only)
npm install

# Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:migrate

# Start the server
npm run dev
```

Backend should now be running at **http://localhost:3001**

## Step 3: Start the Frontend

Open a new terminal:

```bash
cd ~/Documents/votr-app/frontend

# Install dependencies (first time only)
npm install

# Start the dev server
npm run dev
```

Frontend should now be running at **http://localhost:5173**

## Step 4: Create Your First Competition

1. Open **http://localhost:5173** in your browser
2. Click **"Admin Panel"** from the landing page
3. Create a competition (e.g., "Chili Cook-Off 2025")
4. Add at least 5 contestants
5. Click **"Test Voting"** or go to **"View All Competitions"**

## Step 5: Vote!

1. Select your competition
2. Drag your top 5 choices into the ranked slots
3. Submit your vote
4. View the animated results!

## Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running
- Check the DATABASE_URL in `backend/.env`
- Default: `postgresql://postgres:postgres@localhost:5432/votr_db?schema=public`

### Port Already in Use
- Backend default: 3001
- Frontend default: 5173
- Change ports in `backend/.env` and `frontend/vite.config.ts` if needed

### CORS Errors
- Make sure both backend and frontend are running
- Backend should allow requests from frontend origin

## What's Next?

- Customize colors in `frontend/tailwind.config.js`
- Adjust scoring in `backend/src/routes/votes.ts`
- Add images to contestants via image URLs
- Share competition links with voters!

Enjoy VOTR! 🎯
