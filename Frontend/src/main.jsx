import {BrowserRouter,  Route,Routes} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'

import First from './Pages/First.jsx'
import Login from './Pages/Login.jsx'
import Signup from './Pages/Signup.jsx'
import Home from './Pages/Home.jsx'
import Addbus from './Pages/Addbus.jsx'
import BookSeatWrapper from './Pages/BookSeatWrapper.jsx'
import SeatDetails from './Pages/SeatDetails.jsx'
import UserProfile from './Pages/UserProfile.jsx'
import Dev from './Pages/Dev.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Toaster position="top-right" />
    <Routes>
      <Route path='/' element={<First/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/addbus' element={<Addbus/>} />
      <Route path='/bookseat' element={<BookSeatWrapper/>} />
      <Route path='/seat-details/:seatId' element={<SeatDetails/>} />
      <Route path='/profile' element={<UserProfile/>} />
      <Route path='/devinfo' element={<Dev/>} />
    </Routes>
  </BrowserRouter>
)
