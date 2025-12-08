import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Создам позже
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
// import ProjectsPage from './pages/ProjectsPage';
// import ProjectDetailPage from './pages/ProjectDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<TestPage />} />
        {/* Временно редирект на login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Добавлю позже:
        <Route path="/" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
