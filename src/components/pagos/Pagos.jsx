import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pagos = () => {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    const obtenerPagos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/pago');
        setPagos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error al obtener los pagos:', error);
        setPagos([]);
      }
    };

    obtenerPagos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Enviando nueva solicitud de pago');
      const response = await axios.post('http://localhost:3000/api/pago', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPagos([...pagos, response.data]);
    } catch (error) {
      console.error('Error al agregar el pago:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/pago/${id}`);
      setPagos(pagos.filter(pago => pago.id !== id));
    } catch (error) {
      console.error('Error al eliminar el pago:', error);
    }
  };

  return (
    <div className="container">
      <h1>Gestión de Pagos</h1>

      <form onSubmit={handleSubmit}>
        <button type="submit">Agregar Pago</button>
      </form>

      <ul>
        {pagos.map(pago => (
          <li key={pago.id}>
            {pago.descripcion} - {pago.monto}
            <button onClick={() => handleDelete(pago.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagos;
