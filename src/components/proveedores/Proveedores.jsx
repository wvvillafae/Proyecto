import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Proveedor.css';
import ProveedoresTabla from './ProveedoresTabla';

const Proveedores = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token'); 

   
    axios.get('http://localhost:3000/api/proveedor', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setProveedores(response.data);
    })
    .catch(error => {
      console.error('Error fetching proveedores:', error);
    });
  }, []);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem('token'); 
    const nuevoProveedor = {
      nombre: event.target.elements.nombre.value,
      nit: event.target.elements.nit.value,
      direccion: event.target.elements.direccion.value,
      telefono: parseInt(event.target.elements.telefono.value, 10),
      email: event.target.elements.email.value,
      precio: parseFloat(event.target.elements.precio.value)
    };

    console.log('Datos enviados:', nuevoProveedor);

   
    axios.post('http://localhost:3000/api/proveedor', nuevoProveedor, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setProveedores([...proveedores, response.data]);
      setMostrarFormulario(false);
    })
    .catch(error => {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        setErrorMessage(error.response.data.message.join(', ')); 
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    });
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
  };

  const editarProveedor = (index, nuevoNombre, nuevoEmail) => {
    const token = localStorage.getItem('token'); 

    const proveedorAEditar = proveedores[index];
    if (!proveedorAEditar.id) {
      console.error('Error: El proveedor no tiene un ID');
      return;
    }

    const datosActualizados = {
      nombre: nuevoNombre,
      email: nuevoEmail
    };

    // PATCH /api/proveedor/{id}
    axios.patch(`http://localhost:3000/api/proveedor/${proveedorAEditar.id}`, datosActualizados, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      const nuevosProveedores = [...proveedores];
      nuevosProveedores[index] = response.data;
      setProveedores(nuevosProveedores);
    })
    .catch(error => {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    });
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
    <div className="proveedores-container">
      <div className="header-container">
        <h2 className="subtitulo">Proveedores</h2>
        <input 
          type="text"
          className="search-bar"
          placeholder="Buscar proveedor..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <button className="agregar-button" onClick={toggleFormulario}>Agregar</button>
      {mostrarFormulario && (
        <form className="formulario-proveedor" onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre del proveedor" name="nombre" required />
          <input type="text" placeholder="NIT" name="nit" required />
          <input type="text" placeholder="Dirección" name="direccion" required />
          <input type="text" placeholder="Teléfono" name="telefono" required />
          <input type="email" placeholder="Correo electrónico" name="email" required />
          <input type="number" placeholder="Precio" name="precio" required />
          <button type="submit" className="guardar-button">Guardar</button>
          <button type="button" className="cancelar-button" onClick={handleCancelar}>Cancelar</button>
        </form>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <ProveedoresTabla proveedores={proveedores} editarProveedor={editarProveedor} />
    </div>
  );
};

export default Proveedores;
