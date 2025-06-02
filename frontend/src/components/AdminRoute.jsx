import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/" />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT decode
    if (payload.rol === 'admin') {
      return children;
    } else {
      return <Navigate to="/islemler" />;
    }
  } catch (err) {
    return <Navigate to="/" />;
  }
};

export default AdminRoute;
