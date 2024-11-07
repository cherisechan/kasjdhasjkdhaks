import React from 'react'
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <div className="text-2xl font-bold text-white">Presto</div>
        <div className="flex space-x-4">
          <button onClick={() => navigate('/login')} className="text-white bg-violet-700 hover:bg-violet-500 font-bold py-2 px-4 rounded">Log In</button>
          <button onClick={() => navigate('/register')} className="text-white bg-violet-700 hover:bg-violet-500 font-bold py-2 px-4 rounded">Register</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar