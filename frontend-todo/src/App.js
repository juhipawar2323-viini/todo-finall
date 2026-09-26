import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Todos from './pages/Todos';
import './App.css';

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/todos" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/todos" /> : <Register />} />
          <Route 
            path="/todos" 
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to={user ? "/todos" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
