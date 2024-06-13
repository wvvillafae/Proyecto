import React, { useState } from 'react';
import './ProveedoresTabla.css';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const ProveedoresTabla = ({ proveedores, editarProveedor }) => {
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [emailEditado, setEmailEditado] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const proveedoresPorPagina = 100;

  const handleEditar = (index, nombre, email) => {
    setEditandoIndex(index);
    setNombreEditado(nombre);
    setEmailEditado(email);
  };
  
  const handleGuardarEdicion = () => {
    editarProveedor(editandoIndex, nombreEditado, emailEditado);
    setEditandoIndex(null);
    setNombreEditado('');
    setEmailEditado('');
  };
  
  const handleCancelarEdicion = () => {
    setEditandoIndex(null);
    setNombreEditado('');
    setEmailEditado('');
  };

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const indiceUltimoProveedor = paginaActual * proveedoresPorPagina;
  const indicePrimerProveedor = indiceUltimoProveedor - proveedoresPorPagina;
  const proveedoresActuales = proveedores.slice(indicePrimerProveedor, indiceUltimoProveedor);
  const totalPaginas = Math.ceil(proveedores.length / proveedoresPorPagina);

  return (
    <div>
      <table className="tabla-proveedores">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>NIT</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedoresActuales.map((proveedor, index) => (
            <tr key={indicePrimerProveedor + index}>
              <td>{editandoIndex === indicePrimerProveedor + index ? (
                <input type="text" value={nombreEditado} onChange={(e) => setNombreEditado(e.target.value)} />
              ) : proveedor.nombre}</td>
              <td>{editandoIndex === indicePrimerProveedor + index ? (
                <input type="email" value={emailEditado} onChange={(e) => setEmailEditado(e.target.value)} />
              ) : proveedor.email}</td>
              <td>{proveedor.nit}</td>
              <td>{proveedor.direccion}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.precio}</td>
              <td>
                {editandoIndex === indicePrimerProveedor + index ? (
                  <>
                    <button onClick={handleGuardarEdicion}><FaSave /></button>
                    <button onClick={handleCancelarEdicion}><FaTimes /></button>
                  </>
                ) : (
                  <div className="Table-button">
                    <button onClick={() => handleEditar(indicePrimerProveedor + index, proveedor.nombre, proveedor.email)}><FaEdit /></button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="paginacion">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button key={i + 1} onClick={() => cambiarPagina(i + 1)} className={paginaActual === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProveedoresTabla;
