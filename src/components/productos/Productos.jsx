import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Productos.css';
import ProductoFormulario from './ProductoFormulario';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formularioRef = useRef(null);

  useEffect(() => {
    cargarProductos();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cargarProductos = async () => {
    const token = sessionStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:3000/api/producto', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const productosData = response.data.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        proveedor: producto.proveedor ? producto.proveedor.nombre : ''
      }));
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const handleEditar = (producto) => {
    setEditandoProducto(producto);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    const token = sessionStorage.getItem('token');

    try {
      await axios.delete(`http://localhost:3000/api/producto/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    const token = sessionStorage.getItem('token');

    try {
      let response;
      if (editandoProducto) {
        response = await axios.patch(`http://localhost:3000/api/producto/${editandoProducto.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post('http://localhost:3000/api/producto', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      const productoGuardado = {
        id: response.data.id,
        nombre: response.data.nombre,
        descripcion: response.data.descripcion,
        precio: response.data.precio,
        proveedor: response.data.proveedor ? response.data.proveedor.nombre : ''
      };

      if (editandoProducto) {
        setProductos(productos.map(p => (p.id === productoGuardado.id ? productoGuardado : p)));
      } else {
        setProductos([...productos, productoGuardado]);
      }

      setEditandoProducto(null);
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      if (error.response && error.response.data) {
        console.error('Error de respuesta del servidor:', error.response.data); 

        // Manejo específico de errores según la respuesta del servidor
        let errorMessage = 'Error desconocido al guardar el producto';

        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join(', ');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }

        setErrorMessage(errorMessage);
      } else {
        console.error('Error en la solicitud:', error.message); 
        setErrorMessage('Error desconocido al guardar el producto');
      }
    }
  };

  const handleClickOutside = (event) => {
    if (formularioRef.current && !formularioRef.current.contains(event.target)) {
      setMostrarFormulario(false);
    }
  };

  return (
    <div className="productos-container">
      <h2 className="productos-title">Lista de Productos</h2>
      <button className="agregar-button" onClick={() => {
        setEditandoProducto(null);
        setMostrarFormulario(true);
      }}>Agregar Producto</button>
      {mostrarFormulario && (
        <div className="overlay" onClick={() => setMostrarFormulario(false)}>
          <div className="formulario-container" ref={formularioRef} onClick={(e) => e.stopPropagation()}>
            <ProductoFormulario onSubmit={handleFormSubmit} initialValues={editandoProducto || {}} />
          </div>
        </div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <table className="productos-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.precio}</td>
              <td>{producto.proveedor}</td>
              <td>
                <button className="editar-button" onClick={() => handleEditar(producto)}>Editar</button>
                <button className="eliminar-button" onClick={() => handleEliminar(producto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;