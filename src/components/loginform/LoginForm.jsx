import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input } from "@nextui-org/react";
import { FaUser } from 'react-icons/fa';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedRefreshToken = sessionStorage.getItem('refreshToken');
    if (storedToken) {
      const decodedToken = decodeToken(storedToken);
      if (decodedToken) {
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log('Token expirado, intentando refrescar...');
          refreshAccessToken(storedRefreshToken);
        } else {
          console.log('Token válido, configurando temporizador para refresco.');
          setRefreshTimer(decodedToken.exp * 1000 - Date.now() - 60000, storedRefreshToken);
          onLoginSuccess();
        }
      } else {
        console.error('Error al decodificar el token almacenado.');
        setError('Error al decodificar el token almacenado. Por favor, inicia sesión de nuevo.');
      }
    }
  }, [onLoginSuccess]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Intentando iniciar sesión...');
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });

      if (response.data && response.data.tokens) {
        const { accessToken, refreshToken } = response.data.tokens;
        sessionStorage.setItem('token', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);

        const decodedToken = decodeToken(accessToken);
        setRefreshTimer(decodedToken.exp * 1000 - Date.now() - 60000, refreshToken);

        // Obtener roles después del login
        console.log('Intentando obtener roles del usuario...');
        const rolesResponse = await axios.get('http://localhost:3000/api/auth/roles', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (rolesResponse.data) {
          console.log('Roles obtenidos:', rolesResponse.data);
          sessionStorage.setItem('roles', JSON.stringify(rolesResponse.data));
          onLoginSuccess();
        } else {
          setError('No se pudieron obtener los roles del usuario.');
          console.error('Respuesta del servidor sin datos de roles:', rolesResponse);
        }
      } else {
        setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        console.error('Respuesta del servidor sin tokens:', response);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/refresh', { refreshToken });

      if (response.status === 200 && response.data && response.data.accessToken) {
        const { accessToken } = response.data;
        sessionStorage.setItem('token', accessToken);

        const decodedToken = decodeToken(accessToken);
        setRefreshTimer(decodedToken.exp * 1000 - Date.now() - 60000, refreshToken);

        console.log('Token refrescado exitosamente');
        onLoginSuccess();
      } else {
        setError('Error al refrescar el token. Por favor, inicia sesión de nuevo.');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        console.error('Error al refrescar token, respuesta:', response);
      }
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      setError('Se ha superado el tiempo de espera de tu sesión');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
    }
  };

  const setRefreshTimer = (timeout, refreshToken) => {
    setTimeout(() => refreshAccessToken(refreshToken), timeout);
  };

  const decodeToken = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token no tiene el formato adecuado.');
      }
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-text">Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="login-inputs-container">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su email"
            required
            className="login-form-username"
          />
          <Input
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
            className="login-form-password"
          />
        </div>
        <Button type="submit" variant="shadow" className="login-form-submit">
          <FaUser /> Iniciar sesión
        </Button>
        {error && <p className="login-form-error-message">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;