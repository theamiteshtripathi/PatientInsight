import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme'; // Import the theme we'll create
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import { useAuth } from './context/AuthContext';
import ReportsHistoryPage from './pages/ReportsHistoryPage';
import ConsultationHistoryPage from './pages/ConsultationHistoryPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Import locale if needed
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import LifestyleTipsPage from './pages/LifestyleTipsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import SettingsPage from './pages/SettingsPage';
import RegisterPage from './pages/RegisterPage';
import PatientsPage from './pages/PatientsPage';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage';
import DoctorMedicalReportsPage from './pages/DoctorMedicalReportsPage';
import DoctorChatPage from './pages/DoctorChatPage';
import DoctorSettingsPage from './pages/DoctorSettingsPage';

// Extend dayjs with plugins
dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/doctor-dashboard"
                element={
                  <PrivateRoute>
                    <DoctorDashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/symptom-checker"
                element={
                  <PrivateRoute>
                    <SymptomCheckerPage />
                  </PrivateRoute>
                }
              />
              <Route path="/reports" element={<ReportsHistoryPage />} />
              <Route path="/consultation-history" element={<ConsultationHistoryPage />} />
              <Route path="/lifestyle-tips" element={<LifestyleTipsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/doctor/patients" element={<PatientsPage />} />
              <Route 
                path="/doctor/appointments" 
                element={
                  <PrivateRoute>
                    <DoctorAppointmentsPage />
                  </PrivateRoute>
                } 
              />
              <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
              <Route path="/doctor/medical-reports" element={<DoctorMedicalReportsPage />} />
              <Route path="/doctor/chat" element={<DoctorChatPage />} />
              <Route path="/doctor/settings" element={<DoctorSettingsPage />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
