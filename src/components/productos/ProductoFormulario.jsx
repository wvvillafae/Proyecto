import React, { useState, useEffect } from 'react';
import './ProductoFormulario.css';

const ProductoFormulario = ({ onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    nombre: initialValues.nombre || '',
    descripcion: initialValues.descripcion || '',
    precio: initialValues.precio || '',
    proveedorNombre: initialValues.proveedor ? initialValues.proveedor.nombre || '' : ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      nombre: initialValues.nombre || '',
      descripcion: initialValues.descripcion || '',
      precio: initialValues.precio || '',
      proveedorNombre: initialValues.proveedor ? initialValues.proveedor.nombre || '' : ''
    });
  }, [initialValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formDataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      proveedor: {
        nombre: formData.proveedorNombre
      }
    };

    console.log('Enviando formulario:', formDataToSend);

    try {
      await onSubmit(formDataToSend);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        proveedorNombre: ''
      });
    } catch (error) {
      console.error('Error al enviar formulario:', error);


      // Mostrar error al usuario
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Error desconocido al guardar el producto'}`);
      } else if (error.request) {
        setError('Error en la solicitud. No se recibió respuesta del servidor.');
      } else {
        setError('Error desconocido al guardar el producto');
      }
    }
  };

  return (
    <form className="producto-formulario" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        placeholder="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleInputChange}
        required
      />
      <input
        type="number"
        placeholder="Precio"
        name="precio"
        value={formData.precio}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        placeholder="Proveedor"
        name="proveedorNombre"
        value={formData.proveedorNombre}
        onChange={handleInputChange}
        required
      />
      <button type="submit">Guardar</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default ProductoFormulario;