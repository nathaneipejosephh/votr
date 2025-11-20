# VOTR - Ranked Voting Platform

A full-stack drag-and-drop Top-5 ranked voting application with dark animated UI inspired by LandoNorris.com.

## Features

- **Create Competitions** - Organizers can create voting competitions and add contestants
- **Drag & Drop Voting** - Users drag 5 contestants into ranked slots (1st-5th place)
- **Borda Count Scoring** - Fair point system (7/5/3/2/1 points for ranks 1-5)
- **Animated Results** - Live leaderboard with rising bars and winner celebration
- **Duplicate Prevention** - UUID-based voter tracking prevents multiple votes
- **Dark Animated UI** - Neon accents, smooth transitions, GSAP animations

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL database
- Prisma ORM
- TypeScript

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- GSAP animations
- @dnd-kit for drag-and-drop
- React Router

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running

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

   Configure your database in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/votr_db?schema=public"
   PORT=3001
   NODE_ENV=development
   ```

   Create the database:
   ```bash
   # Using psql
   psql -U postgres
   CREATE DATABASE votr_db;
   \q
   ```

   Generate Prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
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
   npm run dev
   ```

   The app will be running at `http://localhost:5173`

## Usage

### Admin Panel
1. Navigate to `/admin`
2. Create a new competition
3. Add contestants (at least 5 required for voting)
4. Share the competition link with voters

### Voting
1. Go to `/competitions` to see active competitions
2. Click on a competition to vote
3. Drag your top 5 choices into the ranked slots
4. Submit your vote
5. View results instantly

### Results
- View live results at `/results/:competitionId`
- See animated leaderboard with point totals
- Rank breakdown shows how many 1st, 2nd, 3rd, 4th, 5th place votes each contestant received

## Project Structure

```
votr-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── routes/                # API routes
│   │   │   ├── competitions.ts
│   │   │   ├── contestants.ts
│   │   │   ├── votes.ts
│   │   │   └── results.ts
│   │   ├── utils/
│   │   │   └── prisma.ts          # Prisma client
│   │   └── index.ts               # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/            # Reusable components
    │   │   ├── ContestantCard.tsx
    │   │   └── RankedSlot.tsx
    │   ├── pages/                 # Page components
    │   │   ├── LandingPage.tsx
    │   │   ├── AdminPage.tsx
    │   │   ├── CompetitionsPage.tsx
    │   │   ├── VotePage.tsx
    │   │   └── ResultsPage.tsx
    │   ├── types/                 # TypeScript types
    │   │   └── index.ts
    │   ├── utils/                 # Utilities
    │   │   ├── api.ts
    │   │   └── voterStorage.ts
    │   ├── App.tsx                # Main app with routing
    │   ├── index.css              # Global styles
    │   └── main.tsx
    └── package.json
```

## API Endpoints

### Competitions
- `GET /api/competitions` - Get all competitions
- `GET /api/competitions/:id` - Get single competition
- `POST /api/competitions` - Create competition
- `PUT /api/competitions/:id` - Update competition
- `DELETE /api/competitions/:id` - Delete competition

### Contestants
- `GET /api/contestants/competition/:competitionId` - Get contestants for competition
- `POST /api/contestants` - Create contestant
- `PUT /api/contestants/:id` - Update contestant
- `DELETE /api/contestants/:id` - Delete contestant

### Votes
- `POST /api/votes` - Submit a vote
- `GET /api/votes/check/:competitionId/:voterId` - Check if voter has voted

### Results
- `GET /api/results/:competitionId` - Get competition results

## Borda Count Scoring

The app uses Borda Count scoring for fair ranked voting:

- **1st place**: 7 points
- **2nd place**: 5 points
- **3rd place**: 3 points
- **4th place**: 2 points
- **5th place**: 1 point

Contestants are ranked by total points accumulated across all votes.

## Features in Detail

### Landing Page
- LandoNorris.com inspired design
- Animated hero section with floating gradient orbs
- Feature showcase with scroll animations
- Tech stack display
- Smooth GSAP transitions

### Drag & Drop
- Intuitive drag-and-drop interface using @dnd-kit
- Visual feedback during dragging
- Ranked slots with color-coded badges
- Point values displayed for each rank
- Contestants can be moved between slots or back to available pool

### Results Animation
- Staggered card entrance animations
- Growing progress bars
- Winner celebration with crown and pulsing glow
- Rank distribution breakdown
- Real-time vote counts

### Voter Tracking
- UUID generated and stored in localStorage
- Prevents duplicate votes per competition
- Allows voting in multiple competitions
- No authentication required for voters

## Development

### Backend Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript
npm start            # Run compiled JavaScript
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio GUI
```

### Frontend Scripts
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Customization

### Colors
Edit `frontend/tailwind.config.js` to customize neon colors:
```js
colors: {
  neon: {
    blue: '#00f0ff',
    pink: '#ff00ff',
    green: '#00ff00',
    orange: '#ff6b00',
  },
}
```

### Point System
Modify `backend/src/routes/votes.ts` to change Borda Count scoring:
```typescript
const POINTS_MAP: { [key: number]: number } = {
  1: 7,  // Change these values
  2: 5,
  3: 3,
  4: 2,
  5: 1
};
```

## License

MIT License - feel free to use this project for your own voting needs!

## Credits

Built with inspiration from LandoNorris.com's sleek animated design.
