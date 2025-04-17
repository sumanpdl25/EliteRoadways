import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const SeatDetails = () => {
  const { seatId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookedUser, setBookedUser] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("/api/v1/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserProfile(response.data.user);
        setIsAdmin(response.data.user.role === "admin");
        setPhoneNumber(response.data.user.phone || "");
        setPickupLocation(response.data.user.address || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch user profile");
      }
    };

    const fetchBusInfo = async () => {
      try {
        const busId = localStorage.getItem("selectedBusId");
        if (!busId) {
          navigate("/home");
          return;
        }

        const response = await axios.get(`/api/v1/bus/getbus/${busId}`);
        setBusInfo(response.data.bus);
        
        if (response.data.bus.bookedBy && response.data.bus.bookedBy[seatId]) {
          const bookingInfo = response.data.bus.bookedBy[seatId];
          setBookingDetails(bookingInfo);
          setBookedUser({
            name: bookingInfo.userId?.username || "Booked User",
            contactNumber: bookingInfo.contactNumber,
            pickupLocation: bookingInfo.pickupLocation
          });
        }
      } catch (error) {
        console.error("Error fetching bus info:", error);
        toast.error("Failed to fetch bus information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchBusInfo();
  }, [navigate, seatId]);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const busId = localStorage.getItem("selectedBusId");
      const selectedSeat = localStorage.getItem("selectedSeat");
      
      if (!busId || !selectedSeat) {
        navigate("/home", { 
          state: { 
            toast: {
              type: "error",
              message: "Missing booking information"
            }
          }
        });
        return;
      }

      if (!pickupLocation || !phoneNumber) {
        toast.error("Please fill in all required fields", {
          duration: 2000,
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "#fff",
            fontSize: "16px",
            padding: "16px",
            borderRadius: "8px",
          },
        });
        return;
      }

      // Make booking request
      const response = await axios.post(
        "/api/v1/bus/bookseat",
        {
          busId,
          seatNumber: selectedSeat,
          userId: userProfile._id,
          pickupLocation,
          contactNumber: phoneNumber
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Clear the selected bus and seat from localStorage
        localStorage.removeItem("selectedBusId");
        localStorage.removeItem("selectedSeat");
        // Navigate to home page with success message
        navigate("/home", { 
          state: { 
            toast: {
              type: "success",
              message: "🎉 Booking Successful! Your seat has been reserved."
            }
          }
        });
      }
    } catch (error) {
      console.error("Error booking seat:", error);
      navigate("/home", { 
        state: { 
          toast: {
            type: "error",
            message: error.response?.data?.message || "❌ Booking Failed! Please try again."
          }
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          src="/bus1.jpg" 
          alt="Bus" 
          className="w-full h-full object-cover opacity-40"
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
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
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-green-400">
              Seat Details
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white/90">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                  Bus Information
                </span>
              </h2>
              <div className="space-y-4">
                <p className="text-white/90">Seat Number: {seatId}</p>
                <p className="text-white/90">Bus Number: {busInfo?.busnum}</p>
                <p className="text-white/90">Driver: {busInfo?.driver}</p>
                <p className="text-white/90">Route: {busInfo?.origin} → {busInfo?.destination}</p>
                <p className="text-white/90">Departure Time: {new Date(busInfo?.departuretime).toLocaleString()}</p>
                <p className="text-white/90">Fare: NRS {busInfo?.fare}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white/90">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                  Booking Details
                </span>
              </h2>
              {isAdmin && bookingDetails ? (
                <div className="space-y-4">
                  <p className="text-white/90">Booked By: {bookedUser?.name}</p>
                  <p className="text-white/90">Contact: {bookingDetails.contactNumber}</p>
                  <p className="text-white/90">Pickup Location: {bookingDetails.pickupLocation}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-white/90">Status: {bookingDetails ? "Booked" : "Available"}</p>
                  {!bookingDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10"
                    >
                      <h2 className="text-3xl font-bold text-white/90 mb-6 text-center">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-green-400">
                          Complete Your Booking
                        </span>
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-white/90 text-lg font-medium mb-2">
                            Pickup Location
                          </label>
                          <input
                            type="text"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            placeholder="Enter your pickup location"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/90 text-lg font-medium mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-xl font-semibold text-white/90">
                            Total Amount: NRS {busInfo?.fare}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBooking}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Book Now
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SeatDetails;