import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // hide buttons on navbar on login and register page
  const showButtons = location.pathname !== '/login' && location.pathname !== '/register';
  
  return (
    <div className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <button onClick={() => navigate('/')} className="text-xl font-bold text-white py-2 px-4">Presto</button>
        {showButtons && (
          <div className="flex space-x-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-700 font-bold py-2 px-4 rounded">Logout</button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-white hover:bg-violet-500 font-bold py-2 px-4 rounded">Log In</button>
                <button onClick={() => navigate('/register')} className="text-white hover:bg-violet-500 font-bold py-2 px-4 rounded">Register</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar