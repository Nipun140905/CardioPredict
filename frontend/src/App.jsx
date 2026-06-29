import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Prediction from './pages/Prediction';
import History from './pages/History';
import ModelComparison from './pages/ModelComparison';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-5">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.className = '';
    if (['/login', '/signup', '/verify-otp'].includes(location.pathname)) {
      document.body.classList.add('page-auth');
    } else if (['/predict', '/history', '/models', '/profile'].includes(location.pathname)) {
      document.body.classList.add('page-app');
    }
  }, [location.pathname]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />
        <Route path="/verify-otp" element={<Navigate to="/login" replace />} />
        <Route path="/predict" element={<ProtectedRoute><Prediction /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/models" element={<ProtectedRoute><ModelComparison /></ProtectedRoute>} />
      </Routes>
      <footer className="footer-disclaimer">
        Not a substitute for professional medical diagnosis. For educational and research purposes only.
      </footer>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;