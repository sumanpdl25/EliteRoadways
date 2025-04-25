import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

function Mybookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch all buses to get booking information
        const response = await axios.get("/api/v1/bus/getbus", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          // Get current user's profile
          const userResponse = await axios.get("/api/v1/users/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const currentUserId = userResponse.data.user._id;

          // Group bookings by bus
          const bookingsByBus = {};
          
          response.data.buses.forEach(bus => {
            if (bus.bookedBy && Array.isArray(bus.bookedBy)) {
              const userSeats = bus.bookedBy
                .filter(booking => 
                  booking && booking.userId && booking.userId.toString() === currentUserId
                )
                .map(booking => booking.seat);

              if (userSeats.length > 0) {
                const busKey = bus.busnum;
                if (!bookingsByBus[busKey]) {
                  bookingsByBus[busKey] = {
                    busNumber: bus.busnum,
                    route: `${bus.origin} → ${bus.destination}`,
                    time: new Date(bus.departuretime).toLocaleString(),
                    fare: bus.fare,
                    seats: []
                  };
                }
                bookingsByBus[busKey].seats.push(...userSeats);
              }
            }
          });

          // Convert to array and sort by bus number
          const sortedBookings = Object.values(bookingsByBus)
            .sort((a, b) => a.busNumber.localeCompare(b.busNumber));

          setBookings(sortedBookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings");
        toast.error("Failed to load your bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (busNumber, seatNumber) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // First get the bus ID
      const busResponse = await axios.get("/api/v1/bus/getbus", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const bus = busResponse.data.buses.find(b => b.busnum === busNumber);
      if (!bus) {
        toast.error("Bus not found");
        return;
      }

      const response = await axios.post(
        "/api/v1/bus/cancelbooking",
        { busId: bus._id, seatNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Booking cancelled successfully");
        // Update the bookings state
        setBookings(prevBookings => 
          prevBookings.map(booking => {
            if (booking.busNumber === busNumber) {
              return {
                ...booking,
                seats: booking.seats.filter(seat => seat !== seatNumber)
              };
            }
            return booking;
          }).filter(booking => booking.seats.length > 0) // Remove bus if no seats left
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
            My Bookings
          </span>
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            You have no bookings yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.busNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Bus {booking.busNumber}
                    </h2>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <span className="text-blue-400">Seat Numbers:</span>{" "}
                        <span className="bg-blue-500/20 px-2 py-1 rounded">
                          {booking.seats.sort().join(", ")}
                        </span>
                      </p>
                      <p className="text-gray-300">
                        <span className="text-blue-400">Route:</span> {booking.route}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-blue-400">Departure:</span> {booking.time}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <span className="text-blue-400">Fare per seat:</span> NRS {booking.fare}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-blue-400">Total Fare:</span> NRS {booking.fare * booking.seats.length}
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      {booking.seats.map(seatNumber => (
                        <motion.button
                          key={seatNumber}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel seat ${seatNumber}?`)) {
                              handleCancelBooking(booking.busNumber, seatNumber);
                            }
                          }}
                          className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between"
                        >
                          <span>Cancel Seat {seatNumber}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

    
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
    </div>
  );
}

export default Mybookings;