import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompetitionsPage from './pages/CompetitionsPage';
import AdminPage from './pages/AdminPage';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/vote/:competitionId" element={<VotePage />} />
        <Route path="/results/:competitionId" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
