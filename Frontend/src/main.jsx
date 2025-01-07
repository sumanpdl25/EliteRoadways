
import {BrowserRouter,  Route,Routes} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'

import First from './Pages/First.jsx'
import Login from './Pages/Login.jsx'
import Signup from './Pages/Signup.jsx'
import Home from './Pages/Home.jsx'
import Addbus from './Pages/Addbus.jsx'
import BookSeat from './Pages/BookSeat.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      
      <Routes>
        <Route path='/' element={<First/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/home'  element={<Home/>} />
        <Route path='/addbus'  element={<Addbus/>} />
        <Route path='/bookseat'  element={<BookSeat/>} />
        
      </Routes>
    
 
  </BrowserRouter>

)
