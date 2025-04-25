import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PropTypes from 'prop-types';
import Layout from './components/Layout';
import Home from './Pages/Home';
import About from './Pages/About';   
import Features from './Pages/Features'; 
import Contact from './Pages/Contact'; 
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import BookSeat from './Pages/BookSeat';
import SeatDetails from './Pages/SeatDetails';
import AddBus from './Pages/Addbus';
import BookSeatWrapper from './Pages/BookSeatWrapper';
import Userdetails from './Pages/Userdetails';
import MyBookings from './Pages/Mybookings';
import First from './Pages/First';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<First />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="book-seat" element={<BookSeatWrapper />} />
          <Route path="seat-details/:seatId" element={<SeatDetails />} />
          <Route path="addbus" element={<AddBus />} />
          <Route path="mybookings" element={<MyBookings />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
