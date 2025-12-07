import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Открываем календарь по /calendar */}
        <Route path="/calendar" element={<CalendarPage />} />

        {/* Перенаправляем все маршруты на календарь */}
        <Route path="*" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}
