import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClienteFormulario.css';

const ClienteFormulario = ({ onClienteAgregado, onClienteEditado, cliente, token }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    comentarios: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (cliente) {
      // Excluir id, fechaCreacion, y fechaActualizacion al establecer el estado inicial del formulario
      const { id, fechaCreacion, fechaActualizacion, ...filteredData } = cliente;
      setFormData(filteredData);
    }
  }, [cliente]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Datos enviados:', formData);

    try {
      let response;
      if (cliente) {
        // Si se está editando un cliente existente
        response = await axios.patch(`http://localhost:3000/api/cliente/${cliente.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        onClienteEditado(response.data);
      } else {
        // Si se está agregando un nuevo cliente
        response = await axios.post('http://localhost:3000/api/cliente', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        onClienteAgregado(response.data);
      }

      console.log('Respuesta del servidor:', response.data);

      setFormData({
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        comentarios: ''
      });
    } catch (error) {
      console.error('Error al agregar/editar cliente:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        if (error.response.status === 400) {
          setError(`Error en los datos enviados. Falta algún campo obligatorio. Detalles: ${JSON.stringify(error.response.data)}`);
        } else if (error.response.status === 401) {
          setError('No autorizado. No tiene token.');
        } else {
          setError('Error al agregar/editar cliente. Por favor, inténtalo de nuevo.');
        }
      } else {
        setError('Error al conectar con el servidor. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <form className="cliente-formulario" onSubmit={handleSubmit}>
      <input type="text" placeholder="Nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
      <input type="text" placeholder="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} required />
      <input type="text" placeholder="Teléfono" name="telefono" value={formData.telefono} onChange={handleInputChange} required />
      <input type="email" placeholder="Correo electrónico" name="email" value={formData.email} onChange={handleInputChange} required />
      <input type="text" placeholder="Comentarios" name="comentarios" value={formData.comentarios} onChange={handleInputChange} />
      <button type="submit">{cliente ? 'Actualizar' : 'Guardar'}</button> {/* Cambia el texto del botón según la acción */}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default ClienteFormulario;
