import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import WorkshopStatistics from './pages/WorkshopStatistics';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="spinner" style={{ width: 48, height: 48 }}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/statistics" element={<WorkshopStatistics />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
