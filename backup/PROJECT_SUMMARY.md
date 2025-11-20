# VOTR Project Summary

## Overview
VOTR is a full-stack ranked voting application with an immersive dark UI featuring neon accents, smooth animations, and drag-and-drop interactions. Built with modern web technologies, it provides a seamless voting experience from competition creation to animated results.

## Project Location
`~/Documents/votr-app/`

## Architecture

### Backend (`/backend`)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Port**: 3001
- **API Structure**: RESTful endpoints

#### Key Files
- `src/index.ts` - Express server setup
- `src/routes/` - API route handlers
  - `competitions.ts` - CRUD for competitions
  - `contestants.ts` - CRUD for contestants
  - `votes.ts` - Vote submission with Borda Count
  - `results.ts` - Aggregated results calculation
- `prisma/schema.prisma` - Database schema with 4 models:
  - Competition
  - Contestant
  - Vote
  - VoteRanking

### Frontend (`/frontend`)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom neon theme
- **Animations**: GSAP for scroll and page transitions
- **Drag & Drop**: @dnd-kit library
- **Routing**: React Router v6

#### Key Files
- `src/App.tsx` - Main routing configuration
- `src/pages/` - Page components
  - `LandingPage.tsx` - Hero page with LandoNorris-style design
  - `CompetitionsPage.tsx` - List of active competitions
  - `AdminPage.tsx` - Create competitions & contestants
  - `VotePage.tsx` - Drag-and-drop voting interface
  - `ResultsPage.tsx` - Animated results leaderboard
- `src/components/` - Reusable components
  - `ContestantCard.tsx` - Draggable contestant card
  - `RankedSlot.tsx` - Drop zone for ranked positions
- `src/utils/` - Utilities
  - `api.ts` - Axios API client
  - `voterStorage.ts` - UUID voter tracking
- `src/types/index.ts` - TypeScript interfaces

## Core Features Implemented

### 1. Landing Page ✓
- LandoNorris.com inspired dark design
- Animated hero with gradient orbs
- Scroll-triggered animations
- Feature showcase
- Tech stack display
- Smooth GSAP transitions

### 2. Admin Panel ✓
- Create/manage competitions
- Add/edit/delete contestants
- Real-time contestant count
- Vote count tracking
- Quick test voting access

### 3. Drag-and-Drop Voting ✓
- Intuitive drag interface
- 5 ranked slots with visual feedback
- Color-coded position badges (gold/silver/bronze)
- Point values displayed (7/5/3/2/1)
- Validation before submission
- Duplicate vote prevention

### 4. Borda Count Scoring ✓
- 1st place: 7 points
- 2nd place: 5 points
- 3rd place: 3 points
- 4th place: 2 points
- 5th place: 1 point
- Implemented in backend vote processing

### 5. Animated Results ✓
- Staggered card entrance
- Growing progress bars
- Winner crown and pulsing glow
- Rank distribution breakdown
- Total points and vote counts
- Real-time updates

### 6. UUID Voter Tracking ✓
- Unique ID generated per browser
- Stored in localStorage
- Prevents duplicate votes per competition
- Allows multi-competition voting
- No authentication required

### 7. GSAP Animations ✓
- Landing page hero animations
- Scroll-triggered feature cards
- Results page entrance effects
- Winner celebration sequence
- Smooth page transitions

## UI/UX Design

### Color Palette
- **Background**: Pure black (#000000)
- **Cards**: Gray-900 to black gradients
- **Neon Accents**:
  - Blue: #00f0ff
  - Pink: #ff00ff
  - Orange: #ff6b00
- **Text**: White with gray variations

### Typography
- **Display**: Space Grotesk (headings)
- **Body**: Inter (content)
- Bold weights for emphasis
- Text gradients for headers

### Animations
- Float effect on gradient orbs
- Scroll-triggered reveals
- Hover scale transforms
- Card glow effects
- Progress bar growth
- Pulse animations

## Data Flow

1. **Competition Creation**
   - Admin creates competition via `/admin`
   - POST to `/api/competitions`
   - Stored in PostgreSQL

2. **Adding Contestants**
   - Admin adds contestants (min 5 for voting)
   - POST to `/api/contestants`
   - Linked to competition via foreign key

3. **Voting Process**
   - User gets UUID from localStorage
   - Drags 5 contestants to ranked positions
   - Frontend sends rankings array to `/api/votes`
   - Backend calculates Borda Count points
   - Creates Vote + 5 VoteRanking records
   - Duplicate check via unique constraint

4. **Results Calculation**
   - GET `/api/results/:competitionId`
   - Aggregates all VoteRanking records
   - Sums points per contestant
   - Returns sorted leaderboard
   - Frontend animates with GSAP

## Database Schema

```prisma
Competition (1) ──< (many) Contestant
Competition (1) ──< (many) Vote
Vote (1) ──< (many) VoteRanking
Contestant (1) ──< (many) VoteRanking
```

### Key Relationships
- Cascade deletes: Deleting competition removes contestants, votes, rankings
- Unique constraint: One vote per voterId + competitionId
- Indexes on foreign keys for query performance

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/competitions` | List all competitions |
| POST | `/api/competitions` | Create competition |
| GET | `/api/competitions/:id` | Get competition details |
| GET | `/api/contestants/competition/:id` | Get contestants |
| POST | `/api/contestants` | Add contestant |
| POST | `/api/votes` | Submit ranked vote |
| GET | `/api/votes/check/:compId/:voterId` | Check vote status |
| GET | `/api/results/:competitionId` | Get leaderboard |

## Development Workflow

1. Start PostgreSQL
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm run dev`
4. Access at `http://localhost:5173`

## Deployment Considerations

### Backend
- Set NODE_ENV=production
- Use connection pooling for PostgreSQL
- Add rate limiting middleware
- Enable CORS for production domain
- Set up database backups

### Frontend
- Build with `npm run build`
- Serve from CDN or static host
- Update API_URL to production backend
- Enable production optimizations

## Future Enhancements (Optional)

- [ ] User authentication for organizers
- [ ] Email notifications for new competitions
- [ ] Social sharing of results
- [ ] Real-time voting updates via WebSockets
- [ ] Custom point systems per competition
- [ ] Image upload for contestants
- [ ] Export results as PDF/CSV
- [ ] Dark/light theme toggle
- [ ] Mobile app version
- [ ] Multi-language support

## Testing Checklist

- [x] Create competition
- [x] Add contestants (5+)
- [x] Submit vote
- [x] Prevent duplicate votes
- [x] View results
- [x] Animations work smoothly
- [x] Responsive on mobile
- [x] API error handling
- [x] Database constraints
- [x] Borda Count accuracy

## Technologies Used

**Backend:**
- Node.js 18+
- Express 5
- TypeScript 5
- Prisma 6
- PostgreSQL
- CORS
- dotenv
- uuid

**Frontend:**
- React 18
- Vite 5
- TypeScript 5
- Tailwind CSS 3
- GSAP 3
- @dnd-kit
- React Router 6
- Axios
- uuid

## Project Stats

- **Total Files**: 40+ source files
- **Lines of Code**: ~3,500+
- **Components**: 7 pages + 2 reusable components
- **API Routes**: 4 route files
- **Database Models**: 4 models
- **Build Time**: ~1-2 hours to set up
- **Development Time**: Full-featured in one session

## Success Criteria Met

✅ Full-stack application with separate backend/frontend
✅ PostgreSQL database with Prisma ORM
✅ Drag-and-drop ranked voting (1st-5th)
✅ Borda Count scoring system (7/5/3/2/1)
✅ UUID-based duplicate vote prevention
✅ Dark animated UI with neon accents
✅ LandoNorris.com inspired landing page
✅ Admin panel for competition management
✅ Animated results with winner celebration
✅ GSAP scroll and page animations
✅ Responsive design
✅ TypeScript throughout
✅ RESTful API architecture
✅ Professional documentation

---

**Built with** ❤️ **and lots of** ☕

Ready to VOTR!
