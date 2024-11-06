import "./index.css"
import { BrowserRouter, Routes, Route} from 'react-router-dom'
// import { Landing, Register, Login } from "./pages";
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
