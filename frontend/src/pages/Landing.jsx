import React from 'react'
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center min-h-screen bg-gradient-to-r from-violet-800 to-violet-400 text-white p-20">
      <h1 className="text-7xl font-bold mb-4">Welcome to Presto</h1>
      <p className="text-xl mb-8 max-w-lg">Better than slides.com and Canva?</p>
      <div className="flex space-x-4">
        <button onClick={() => navigate('/register')} className="bg-white text-violet-800 hover:bg-gray-200 font-bold py-4 px-10 rounded">Start presenting today&nbsp;&nbsp;&nbsp;&nbsp;&gt;</button>
        {/* <button onClick={() => navigate('/login')} className="bg-white text-violet-800 hover:bg-gray-200 font-bold py-4 px-10 rounded">Login</button> */}
      </div>
    </div>  
  )
}

export default Landing;