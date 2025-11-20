import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/LandingPage';

function CompetitionsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '2rem' }}>
      <Link to="/" style={{ color: '#00f0ff', textDecoration: 'none' }}>← Back to Home</Link>
      <h1 style={{ fontSize: '3rem', marginTop: '2rem' }}>Competitions</h1>
      <p>No competitions yet. Create one in the admin panel!</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
