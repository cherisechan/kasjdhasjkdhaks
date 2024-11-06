import React from 'react'
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-violet-500 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to Presto</h1>
      <p className="text-xl mb-8 text-center max-w-lg"> Blah blah blah </p>
      <div className="flex space-x-4">
        <button onClick={() => navigate('/register')} className="bg-white text-violet-500 hover:bg-gray-200 font-bold py-2 px-4 rounded">Get Started</button>
        <button onClick={() => navigate('/login')} className="bg-white text-violet-500 hover:bg-gray-200 font-bold py-2 px-4 rounded">Login</button>
      </div>
    </div>  
  )
}

export default Landing;