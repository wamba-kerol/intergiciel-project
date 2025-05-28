import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

// Pages principales
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Pages éducation
import EducationDashboard from './pages/education/EducationDashboard';
import TeacherDashboard from './pages/education/TeacherDashboard';
import StudentDashboard from './pages/education/StudentDashboard';

// Pages bibliothèque
import LibraryDashboard from './pages/library/LibraryDashboard';
import LibraryHomePage from './pages/library/LibraryHomePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Pages principales */}
            <Route path="/" element={<HomePage />} />
            
            {/* Pages d'authentification */}
            <Route path="/login/:type" element={<LoginPage />} />
            <Route path="/register/:type" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Pages éducation */}
            <Route path="/education/admin" element={<EducationDashboard />} />
            <Route path="/education/teacher" element={<TeacherDashboard />} />
            <Route path="/education/student" element={<StudentDashboard />} />
            
            {/* Pages bibliothèque */}
            <Route path="/library/admin" element={<LibraryDashboard />} />
            <Route path="/library/home" element={<LibraryHomePage />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;