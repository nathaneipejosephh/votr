import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import competitionRoutes from './routes/competitions';
import contestantRoutes from './routes/contestants';
import voteRoutes from './routes/votes';
import resultsRoutes from './routes/results';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
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
