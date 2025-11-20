import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import LandingPage from './pages/index';
import CompetitionsPage from './pages/CompetitionsPage';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import JoinPage from './pages/JoinPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/vote/:competitionId" element={<VotePage />} />
          <Route path="/results/:competitionId" element={<ResultsPage />} />
          <Route path="/join" element={<JoinPage />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
