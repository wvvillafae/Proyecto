import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Clientes.css';

import ClienteFormulario from './ClienteFormulario';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const formularioRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    axios.get('http://localhost:3000/api/cliente', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setClientes(response.data);
    })
    .catch(error => {
      console.error('Error fetching clientes:', error);
      setErrorMessage('Error al obtener los clientes. Por favor, inténtalo de nuevo más tarde.');
    });

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (formularioRef.current && !formularioRef.current.contains(event.target)) {
      setMostrarFormulario(false);
      setClienteEditando(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClienteAgregado = (nuevoCliente) => {
    setClientes(prevClientes => [...prevClientes, nuevoCliente]);
    setMostrarFormulario(false); // Cerrar el formulario después de agregar un cliente
  };

  const handleClienteEditado = (clienteEditado) => {
    setClientes(prevClientes => prevClientes.map(cliente => 
      cliente.id === clienteEditado.id ? clienteEditado : cliente
    ));
    setMostrarFormulario(false); // Cerrar el formulario después de editar un cliente
    setClienteEditando(null); // Resetear el cliente que se está editando
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const startEditing = (cliente) => {
    setClienteEditando(cliente);
    setMostrarFormulario(true);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clientes-container">
      <h2 className="subtituloo">Clientes</h2>
      <input 
        type="text"
        className="search-bar"
        placeholder="Buscar cliente..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button className="button-toggle-form" onClick={toggleFormulario}>
        {mostrarFormulario ? 'Ocultar Formulario' : 'Mostrar Formulario'}
      </button>
      {mostrarFormulario && (
        <div className="overlay">
          <div className="overlay-content" ref={formularioRef}>
            <ClienteFormulario 
              onClienteAgregado={handleClienteAgregado}
              onClienteEditado={handleClienteEditado}
              cliente={clienteEditando}
              token={sessionStorage.getItem('token')}
            />
          </div>
        </div>
      )}
      <div className="clientes-table-container">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Comentarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.email}</td>
                <td>{cliente.comentarios}</td>
                <td>
                  <button onClick={() => startEditing(cliente)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;
