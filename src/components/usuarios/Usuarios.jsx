import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from 'react-icons/fa';
import './Usuarios.css';

const statusColorMap = {
  true: "success",
  false: "danger",
};

const Usuario = () => {
  const [users, setUsers] = useState([]);  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let token = sessionStorage.getItem("token");
        let refreshToken = sessionStorage.getItem("refreshToken");
        if (!token) {
          console.error("Token no encontrado");
          return;
        }

        const offset = (currentPage - 1) * usersPerPage;

        const response = await axios.get(`http://localhost:3000/api/auth/users?limit=${usersPerPage}&offset=${offset}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
        
          setUsers(response.data);
          setTotalUsers(response.data.length);
        } else if (response.data && response.data.users) {
        
          setUsers(response.data.users);
          setTotalUsers(response.data.total);
        } else {
          console.error("Estructura de respuesta inesperada:", response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Token expirado, renovando token...");
          await renewTokenAndRetry(fetchUsers);
        } else {
          console.error("Error al obtener usuarios:", error);
        }
      }
    };

    fetchUsers();
  }, [currentPage, searchTerm]);

  const renewTokenAndRetry = async (fetchUsersFunction) => {
    try {
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Refresh token no encontrado');
      }

      const response = await axios.post('http://localhost:3000/api/auth/refresh', {
        refreshToken,
      });

      if (response.status === 200 && response.data.accessToken) {
        const { accessToken } = response.data;
        sessionStorage.setItem('token', accessToken);
        console.log('Token refrescado exitosamente');
        await fetchUsersFunction();
      } else {
        console.error('Error al renovar el token. Por favor, inicia sesión de nuevo.');
      }
    } catch (error) {
      console.error('Error al renovar el token:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); 
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <table aria-label="Tabla de usuarios" className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <div>
                  <span>{user.fullName}</span>
                  <br />
                  <small>{user.email}</small>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={`chip ${statusColorMap[user.isActive]}`}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(totalUsers / usersPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Usuario;
