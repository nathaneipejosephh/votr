import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import competitionRoutes from './routes/competitions';
import contestantRoutes from './routes/contestants';
import voteRoutes from './routes/votes';
import resultsRoutes from './routes/results';
import authRoutes, { passport } from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'votr-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/contestants', contestantRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VOTR API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
