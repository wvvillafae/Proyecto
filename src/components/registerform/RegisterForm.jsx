import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button } from "@nextui-org/react";
import { FaUser } from 'react-icons/fa'; 
import './RegisterForm.css';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password,
        fullName,
        role
      });
  
      console.log('Respuesta del servidor:', response.data);
  
   
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setError('Error al registrar. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="register-form-container">
      <h2 className="register-form-text">Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="register-inputs-container">
          <Input
            type="email"
            label="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su email"
            required
            className="register-form-password"
          />
          <Input
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
            className="register-form-password"
          />
          <Input
            type="text"
            label="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ingrese su nombre completo"
            required
            className="register-form-password"
          />
          <Input
            type="text"
            label="Rol"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ingrese su rol"
            required
            className="register-form-password"
          />
        </div>
        <Button type="submit" variant="shadow" className="register-form-submit">
          <FaUser /> Registrarse
        </Button>
        {error && <p className="register-form-error-message">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
