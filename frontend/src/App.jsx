import "./index.css"
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { Landing, Register, Login, Dashboard } from "./pages";
function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
