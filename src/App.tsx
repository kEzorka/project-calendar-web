import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

// Временные заглушки для CalendarPage и ProfilePage (Самина)
const CalendarPage = () => (
  <div style={{ padding: '2rem' }}>
    <h1>📅 Календарь (в разработке Саминой)</h1>
  </div>
);
const ProfilePage = () => (
  <div style={{ padding: '2rem' }}>
    <h1>👤 Профиль (в разработке Саминой)</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
