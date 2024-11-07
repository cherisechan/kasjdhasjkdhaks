import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-700 font-bold py-2 px-4 rounded">Logout</button>
  );
};

export default Logout;
