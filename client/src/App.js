import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ActivityForm from './pages/ActivityForm';
import ActivityList from './pages/ActivityList';
import AdminDashboard from './pages/AdminDashboard';
import AdminStatistics from './pages/AdminStatistics';
import AdminUsers from './pages/AdminUsers';
import AdminActivities from './pages/AdminActivities';
import AdminBusinessOffices from './pages/AdminBusinessOffices';
import AdminDocumentRequirements from './pages/AdminDocumentRequirements';
import AdminDocumentSubmissions from './pages/AdminDocumentSubmissions';
import DocumentSubmission from './pages/DocumentSubmission';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/activity/new"
              element={
                <PrivateRoute>
                  <ActivityForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/activity/edit/:id"
              element={
                <PrivateRoute>
                  <ActivityForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <ActivityList />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute requireAdmin>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/statistics"
              element={
                <PrivateRoute requireAdmin>
                  <AdminStatistics />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute requireAdmin>
                  <AdminUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/activities"
              element={
                <PrivateRoute requireAdmin>
                  <AdminActivities />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/business-offices"
              element={
                <PrivateRoute requireAdmin>
                  <AdminBusinessOffices />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/document-requirements"
              element={
                <PrivateRoute requireAdmin>
                  <AdminDocumentRequirements />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/document-submissions"
              element={
                <PrivateRoute requireAdmin>
                  <AdminDocumentSubmissions />
                </PrivateRoute>
              }
            />
            <Route
              path="/documents/submit"
              element={
                <PrivateRoute>
                  <DocumentSubmission />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

