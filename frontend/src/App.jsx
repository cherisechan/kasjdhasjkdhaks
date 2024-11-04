import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { Register, Login } from "./pages";
function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
