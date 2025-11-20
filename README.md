# VOTR - Ranked Voting Platform

A full-stack drag-and-drop Top-5 ranked voting application with Google OAuth authentication, QR code sharing, and a dark animated UI.

## Features

### Core Voting
- **Drag & Drop Voting** - Users drag 5 contestants into ranked slots (1st-5th place)
- **Borda Count Scoring** - Fair point system (7/5/3/2/1 points for ranks 1-5)
- **Animated Results** - Live leaderboard with GSAP animations
- **Duplicate Prevention** - UUID-based voter tracking prevents multiple votes

### Admin Features
- **Google OAuth Authentication** - Secure admin sign-in with Google
- **Competition Management** - Create, edit, delete, and publish competitions
- **QR Code Sharing** - Generate QR codes for easy sharing
- **Access Codes** - 6-digit codes for joining competitions
- **Publish Controls** - Toggle voting open/closed

### Voter Options
- **Anonymous Voting** - Vote without any identifying information
- **Named Voting** - Optionally provide your name
- **Join by Code** - Enter 6-digit access code to vote

### UI/UX
- **Dark Animated UI** - Neon accents, smooth transitions, GSAP animations
- **Premium Icons** - Custom SVG icons with gradients and glow effects
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL database
- Prisma ORM
- TypeScript
- Passport.js (Google OAuth)
- QRCode generation

### Frontend
- React 18 + Vite
- JavaScript (JSX)
- GSAP animations
- @dnd-kit for drag-and-drop
- React Router
- Lucide React icons
- React Toastify

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd ~/Documents/votr-app
   ```

2. **Set up the Backend**

   ```bash
   cd backend
   npm install
   ```

   Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

   Configure your `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/votr_db?schema=public"

   # Google OAuth (create at console.cloud.google.com)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

   SESSION_SECRET=your_super_secret_session_key
   FRONTEND_URL=http://localhost:5173
   PORT=3001
   ```

   Create the database:
   ```bash
   psql -U postgres
   CREATE DATABASE votr_db;
   \q
   ```

   Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

   The API will be running at `http://localhost:3001`

3. **Set up the Frontend**

   In a new terminal:
   ```bash
   cd frontend
   npm install
   ```

   Create `.env` file:
   ```bash
   cp .env.example .env
   ```

   Configure:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

   Start the frontend:
   ```bash
   npm run dev
   ```

   The app will be running at `http://localhost:5173`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth Client ID
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
7. Copy Client ID and Client Secret to your `.env` files

## Usage

### Admin Panel
1. Navigate to `/admin`
2. Sign in with Google
3. Create a new competition
4. Add contestants (at least 5 required)
5. Click "Publish" to generate QR code and access code
6. Share with voters!

### Voting
1. Scan QR code or enter access code at `/join`
2. Drag your top 5 choices into ranked slots
3. Choose to vote anonymously or provide your name
4. Submit your vote
5. View results instantly

### Results
- View live results at `/results/:competitionId`
- Animated leaderboard with point totals
- Winner highlighted with special styling

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Competitions
- `GET /api/competitions` - Get all competitions
- `GET /api/competitions/:id` - Get single competition
- `GET /api/competitions/code/:accessCode` - Get by access code
- `POST /api/competitions` - Create competition
- `PUT /api/competitions/:id` - Update competition
- `DELETE /api/competitions/:id` - Delete competition
- `POST /api/competitions/:id/publish` - Publish with QR/code
- `POST /api/competitions/:id/unpublish` - Unpublish

### Contestants
- `GET /api/contestants/competition/:competitionId` - Get contestants
- `POST /api/contestants` - Create contestant
- `PUT /api/contestants/:id` - Update contestant
- `DELETE /api/contestants/:id` - Delete contestant

### Votes
- `POST /api/votes` - Submit a vote (with voter identity options)
- `GET /api/votes/check/:competitionId/:voterId` - Check if voted

### Results
- `GET /api/results/:competitionId` - Get competition results

## Project Structure

```
votr-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.ts            # Auth middleware
│   │   ├── routes/
│   │   │   ├── auth.ts            # Google OAuth
│   │   │   ├── competitions.ts    # Competition CRUD + publish
│   │   │   ├── contestants.ts
│   │   │   ├── votes.ts           # Voting with identity
│   │   │   └── results.ts
│   │   ├── utils/
│   │   │   └── prisma.ts
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ContestantCard.jsx
    │   │   ├── RankedSlot.jsx
    │   │   └── PremiumIcon.jsx    # Custom SVG icons
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state management
    │   ├── pages/
    │   │   ├── LandingPage.jsx    # Home with premium icons
    │   │   ├── AdminPage.jsx      # Full CRUD + publish modal
    │   │   ├── CompetitionsPage.jsx
    │   │   ├── VotePage.jsx       # Drag-drop voting
    │   │   ├── ResultsPage.jsx    # Animated results
    │   │   └── JoinPage.jsx       # Enter access code
    │   ├── api/
    │   │   └── client.js          # API methods
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## Borda Count Scoring

- **1st place**: 7 points
- **2nd place**: 5 points
- **3rd place**: 3 points
- **4th place**: 2 points
- **5th place**: 1 point

## Deployment

### Vercel (Frontend)
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

### Backend
Deploy to Railway, Render, or your preferred Node.js host.
Make sure to set all environment variables.

## Development Scripts

### Backend
```bash
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm start            # Run compiled code
```

### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview build
```

## License

MIT License - feel free to use this project for your own voting needs!
