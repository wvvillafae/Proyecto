import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pedidos.css';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState(''); 
  const [nombrePedido, setNombrePedido] = useState('');
  const [cantidadPedido, setCantidadPedido] = useState('');

  useEffect(() => {
    fetchPedidos();
  }, [accessToken]); 

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/pedido', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('Respuesta de la solicitud:', response.data); 
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
     
      if (error.response && error.response.status === 401) {
        await refreshAccessToken();
      }
    }
  };

  const refreshAccessToken = async () => {
    try {

      const response = await axios.post('http://localhost:3000/api/refresh_token', {
        refresh_token: refreshToken
      });
     
      setAccessToken(response.data.access_token);
   
      await fetchPedidos();
    } catch (error) {
      console.error('Error al refrescar el token:', error);
    }
  };

  const handleEliminarPedido = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/pedido/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      await fetchPedidos();
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/pedido', {
        nombre: nombrePedido,
        cantidad: cantidadPedido
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setNombrePedido('');
      setCantidadPedido('');
      await fetchPedidos();
    } catch (error) {
      console.error('Error al agregar pedido:', error);
    }
  };

  return (
    <div className="pedidos-container">
      <h2 className="pedidos-title">Listado de Pedidos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del pedido"
          value={nombrePedido}
          onChange={(e) => setNombrePedido(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidadPedido}
          onChange={(e) => setCantidadPedido(e.target.value)}
        />
        <button type="submit">Agregar Pedido</button>
      </form>
      <ul className="pedidos-list">
        {Array.isArray(pedidos) && pedidos.map((pedido) => (
          <li key={pedido.id} className="pedidos-item">
            {pedido.nombre} - {pedido.cantidad}
            <button className="eliminar-btn" onClick={() => handleEliminarPedido(pedido.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pedidos;

