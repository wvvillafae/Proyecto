import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/loginform/LoginForm';
import RegisterForm from './components/registerform/RegisterForm';
import Home from './components/home/Home';
import PrivateRoute from './PrivateRoute';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className={`background ${isLoggedIn ? 'logged-in' : ''}`}>
        <div className="forms-container">
          {!isLoggedIn ? (
            <>
              <h1 className="image-text"><p>Bienvenido</p> Por favor, ingresa tus datos para continuar.</h1>
              <div className="forms">
                <LoginForm onLoginSuccess={handleLoginSuccess} />
                <RegisterForm />
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home/*" element={<PrivateRoute isAuthenticated={isLoggedIn} requiredRoles={['user', 'admin']}><Home /></PrivateRoute>} />
              {/* Agrega rutas adicionales aquí, asegurándote de protegerlas según los roles */}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
};

export default App;
