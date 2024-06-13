import React from 'react';
import { FaTruck, FaUserAlt, FaUsers, FaShoppingCart, FaMoneyBillWave, FaShoppingBag } from 'react-icons/fa';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import './Home.css'; 
import Proveedores from '../proveedores/Proveedores';
import Clientes from '../clientes/Clientes';
import Pedidos from '../pedidos/Pedidos';
import Pagos from '../pagos/Pagos';
import Usuarios from '../usuarios/Usuarios';
import Productos from '../productos/Productos';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="sidebar">
        <div className="sidebar-header">Menú</div>
        <ul className="menu-list">
          <li onClick={() => navigate('proveedores')}><FaTruck /> Proveedores</li>
          <li onClick={() => navigate('usuarios')}><FaUserAlt /> Usuarios</li>
          <li onClick={() => navigate('clientes')}><FaUsers /> Clientes</li>
          <li onClick={() => navigate('pedidos')}><FaShoppingCart /> Pedidos</li>
          <li onClick={() => navigate('pagos')}><FaMoneyBillWave /> Pagos</li>
          <li onClick={() => navigate('productos')}><FaShoppingBag />  Productos</li>
        </ul>
      </div>
      <div className="content">
        <Routes>
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="pagos" element={<Pagos />} />
          <Route path="productos" element={<Productos />} />
          <Route path="*" element={<div>Seleccione una sección del menú</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
