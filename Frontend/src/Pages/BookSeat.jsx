import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BookSeat({ selectedSeat, onSelectSeat, busId, bookedSeats, isAdmin }) {
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [busDetails, setBusDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [totalFare, setTotalFare] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { busId, userId, pickupLocation } = location.state;
        
        // Fetch bus details
        const busResponse = await axios.get(`/api/v1/bus/getbus/${busId}`);
        if (!busResponse.data.success) {
          throw new Error("Failed to fetch bus details");
        }
        setBusDetails(busResponse.data.bus);

        // Fetch user details
        const userResponse = await axios.get("/api/v1/users/profile");
        if (!userResponse.data?.user) {
          throw new Error("Failed to fetch user details");
        }
        setUserDetails(userResponse.data.user);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading booking page");
        navigate("/");
      }
    };

    fetchData();
  }, [location.state, navigate]);

  const handleSeatClick = (seat) => {
    if (!seat.available && !isAdmin) {
      toast.error("This seat is already booked");
      return;
    }
    
    // Call the onSelectSeat callback with the seat object
    onSelectSeat(seat);
    
    // Store both the bus ID and selected seat in localStorage
    localStorage.setItem("selectedBusId", busId);
    localStorage.setItem("selectedSeat", seat.id);
    
    // Navigate to SeatDetails with the seat ID as a parameter
    navigate(`/seat-details/${seat.id}`);
  };

  useEffect(() => {
    if (busDetails?.fare) {
      setTotalFare(selectedSeats.length * busDetails.fare);
    }
  }, [selectedSeats, busDetails]);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    try {
      const response = await axios.post(
        "/api/v1/bus/bookseat",
        {
          busId: busDetails._id,
          seats: selectedSeats,
          pickupLocation: location.state.pickupLocation,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Seats booked successfully!");
        navigate("/", {
          state: {
            toast: {
              type: "success",
              message: "Seats booked successfully!",
            },
          },
        });
      } else {
        toast.error(response.data.message || "Failed to book seats");
      }
    } catch (error) {
      console.error("Error booking seats:", error);
      toast.error(error.response?.data?.message || "Error booking seats");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Create 40 seats in a realistic bus layout (10 rows x 4 columns)
  const createSeats = () => {
    const seats = [];
    // Rows 1-10 with 4 seats each
    for (let row = 1; row <= 10; row++) {
      for (let col = 1; col <= 4; col++) {
        const seatNumber = `${row}${String.fromCharCode(64 + col)}`; // e.g., "1A", "1B", etc.
        seats.push({
          id: seatNumber,
          number: seatNumber,
          available: !bookedSeats.includes(seatNumber), // Check if seat is booked
          selected: seatNumber === selectedSeat,
        });
      }
    }
    return seats;
  };

  const seats = createSeats();

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="fixed top-0 left-0 w-screen h-screen z-0"
      >
        <img 
          src="bus4.png" 
          alt="Bus" 
          className="w-full h-full object-cover opacity-40"
        />
      </motion.div>

      {/* Overlay gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900/80 z-0"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-extrabold text-[#90EE90] drop-shadow-lg tracking-tight">
            Select Your Seat
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10"
        >
          <div className="bus-layout relative w-full max-w-4xl mx-auto">
            {/* Bus front */}
            <div className="bus-front h-8 bg-blue-600/40 backdrop-blur-md rounded-t-lg flex items-center justify-center border-b border-white/10">
            </div>
            
            {/* Driver's area with door */}
            <div className="driver-area h-20 bg-gray-300/40 backdrop-blur-md flex items-center justify-between border-b border-white/10">
              {/* Door - Left side */}
              <div className="pl-8">
                <div className="w-14 h-16 bg-gray-400/80 rounded-lg flex flex-col overflow-hidden border-2 border-gray-500/50">
                  {/* Door window */}
                  <div className="w-full h-8 bg-blue-300/30 border-b border-gray-500/50"></div>
                  {/* Door bottom part */}
                  <div className="w-full h-8 relative flex items-center">
                    {/* Door handle */}
                    <div className="absolute right-2 w-2 h-6 bg-gray-600/80 rounded-full flex items-center justify-center">
                      <div className="w-1 h-4 bg-gray-700/80 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver - Right side with steering wheel */}
              <div className="pr-8">
                <div className="w-16 h-16 bg-gray-400/80 rounded-full flex items-center justify-center relative">
                  {/* Steering wheel */}
                  <div className="w-12 h-12 border-4 border-gray-600 rounded-full flex items-center justify-center">
                    {/* Steering wheel spokes */}
                    <div className="absolute w-8 h-1 bg-gray-600 rounded-full"></div>
                    <div className="absolute w-8 h-1 bg-gray-600 rounded-full transform rotate-90"></div>
                    <div className="absolute w-8 h-1 bg-gray-600 rounded-full transform rotate-45"></div>
                    <div className="absolute w-8 h-1 bg-gray-600 rounded-full transform -rotate-45"></div>
                    {/* Center of steering wheel */}
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main seating area */}
            <div className="seating-area p-4">
              <div className="all-rows grid grid-cols-9 gap-2">
                {/* Left side seats */}
                <div className="col-span-4 grid grid-cols-2 gap-4">
                  {seats.filter((_, index) => index % 4 < 2).map((seat, index) => (
                    <motion.button
                      key={`left-${index}`}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSeatClick(seat)}
                      className={`sofa-seat h-20 rounded-lg border-2 flex items-center justify-center relative overflow-hidden shadow-lg backdrop-blur-md ${
                        seat.selected
                          ? "border-blue-400/80 bg-blue-500/20"
                          : seat.available
                          ? "border-green-400/80 bg-green-500/20 hover:shadow-xl"
                          : "border-red-400/80 bg-red-500/20"
                      }`}
                      disabled={!seat.available && !isAdmin}
                    >
                      <div className="absolute top-0 left-0 right-0 h-6 rounded-t-lg" 
                           style={{ 
                             backgroundColor: seat.selected ? 'rgba(59, 130, 246, 0.4)' : seat.available ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                             boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)'
                           }}></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-lg" 
                           style={{ 
                             backgroundColor: seat.selected ? 'rgba(59, 130, 246, 0.2)' : seat.available ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                             boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                           }}></div>
                      
                      <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg" 
                           style={{ 
                             backgroundColor: seat.selected ? 'rgba(59, 130, 246, 0.5)' : seat.available ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                             boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
                           }}></div>
                      <div className="absolute right-0 top-0 bottom-0 w-2 rounded-r-lg" 
                           style={{ 
                             backgroundColor: seat.selected ? 'rgba(59, 130, 246, 0.5)' : seat.available ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                             boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
                           }}></div>
                      
                      <span className="font-bold z-10 text-lg text-white drop-shadow-md">{seat.number}</span>
                    </motion.button>
                  ))}
                </div>
                
                {/* Center aisle */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                    <div className="w-1/2 h-1 bg-gray-400/30 rounded-full"></div>
                  </div>
                </div>
                
                {/* Right side seats */}
                <div className="col-span-4 grid grid-cols-2 gap-4">
                  {seats.filter((_, index) => index % 4 >= 2).map((seat, index) => (
                    <motion.button
                      key={`right-${index}`}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSeatClick(seat)}
                      className={`sofa-seat h-20 rounded-lg border-2 flex items-center justify-center relative overflow-hidden shadow-lg backdrop-blur-md ${
                        seat.selected
                          ? "border-blue-400/80 bg-blue-500/20"
                          : seat.available
                          ? "border-green-400/80 bg-green-500/20 hover:shadow-xl"
                          : "border-red-400/80 bg-red-500/20"
                      }`}
                      disabled={!seat.available && !isAdmin}
                    >
                      <div className="absolute top-0 left-0 right-0 h-6 rounded-t-lg" 
                           style={{ 
                             backgroundColor: seat.selected ? 'rgba(59, 130, 246, 0.4)' : seat.available ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                             boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)'
                           }}></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-lg" 
                           style={{ 
                             backgroundColor: seat.selected ? 'rgba(59, 130, 246, 0.2)' : seat.available ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                             boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                           }}></div>
                      
                      <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg" 
                           style={{ 
                             backgroundColor: seat.selected ? 'rgba(59, 130, 246, 0.5)' : seat.available ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                             boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
                           }}></div>
                      <div className="absolute right-0 top-0 bottom-0 w-2 rounded-r-lg" 
                           style={{ 
                             backgroundColor: seat.selected ? 'rgba(59, 130, 246, 0.5)' : seat.available ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
                             boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
                           }}></div>
                      
                      <span className="font-bold z-10 text-lg text-white drop-shadow-md">{seat.number}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Bus back */}
            <div className="bus-back h-8 bg-blue-600/40 backdrop-blur-md rounded-b-lg border-t border-white/10"></div>
          </div>

          {/* Legend */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="legend mt-8 flex justify-center space-x-8"
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400/80 rounded mr-2"></div>
              <span className="text-white/90">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-400/80 rounded mr-2"></div>
              <span className="text-white/90">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400/80 rounded mr-2"></div>
              <span className="text-white/90">Booked</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 text-center z-10 w-full"
      >
        <p className="text-sm text-[#2A004E] font-light tracking-wide">
          © 2024 Elite Roadways. All Rights Reserved.
        </p>
      </motion.div>

      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/home')}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </motion.button>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="dark"
        toastStyle={{
          background: "#1f2937",
          color: "#fff",
          fontSize: "16px",
          padding: "16px",
          borderRadius: "8px",
          marginTop: "1rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
      />
    </div>
  );
}

BookSeat.propTypes = {
  selectedSeat: PropTypes.string,
  onSelectSeat: PropTypes.func.isRequired,
  busId: PropTypes.string.isRequired,
  bookedSeats: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default BookSeat;
