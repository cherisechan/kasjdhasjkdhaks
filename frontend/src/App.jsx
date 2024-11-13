import "./index.css"
import { useState } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import EditPresentation from "./components/EditPresentation";
import Preview from "./pages/Preview"

function App() {  
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pId");
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/login' element={<Login onLogin={handleLogin} />} />
        <Route path='/register' element={<Register onRegister={handleLogin} />} />
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path="/design/:id" element={<EditPresentation />} />
        <Route path="/preview/:id" element={<Preview />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
