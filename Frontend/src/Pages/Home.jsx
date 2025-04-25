import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Set default axios configuration
axios.defaults.withCredentials = true;

function Home() {
  const [destination, setDestination] = useState("");
  const [buses, setBuses] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show toast if redirected from add bus
  useEffect(() => {
    if (location.state?.toast) {
      const { type, message } = location.state.toast;
      if (type === "success") {
        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      // Clear the state to prevent showing the toast again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch user data and buses
  const fetchData = useCallback(async () => {
    try {
      // Fetch user profile
      const profileResponse = await axios.get("/api/v1/users/profile");
      
      if (!profileResponse.data?.user) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }

      const user = profileResponse.data.user;
      setUserProfile(user);
      setIsAdmin(user.role?.toLowerCase() === "admin");

      // Fetch buses
      const busesResponse = await axios.get("/api/v1/bus/getbus");

      if (busesResponse.data.success) {
        setAllBuses(busesResponse.data.buses);
        setBuses(busesResponse.data.buses);
      } else {
        toast.error("Failed to fetch buses");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Please login with valid credentials.");
        navigate("/login");
      } else {
        toast.error("Error loading data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!destination) {
      toast.error("Please enter a destination to search.");
      return;
    }

    const filteredBuses = allBuses.filter((bus) =>
      bus.destination.toLowerCase().includes(destination.toLowerCase())
    );
    setBuses(filteredBuses);

    if (filteredBuses.length === 0) {
      toast.error(`No buses found for destination: ${destination}`);
    }
  };

  const handleAddBus = () => {
    if (!isAdmin) {
      toast.error("Access denied. Admin only.");
      return;
    }

    navigate("/addbus", {
      state: {
        user: userProfile
      },
      replace: true
    });
  };

  const handleBusClick = (bus) => {
    if (!userProfile) {
      toast.error("Please login to book seats");
      navigate("/login");
      return;
    }

    const totalSeats = 40;
    const availableSeats = totalSeats - (bus.bookedSeats?.length || 0);

    if (availableSeats <= 0) {
      toast.error("No seats available for this bus.");
      return;
    }

    navigate("/bookseat", {
      state: {
        busId: bus._id,
        seatNumber: availableSeats,
        userId: userProfile._id,
        pickupLocation: userProfile.address || "",
      },
      replace: true
    });
  };

  const handleProfileClick = () => {
    if (!userProfile) {
      toast.error("Please login to view profile");
      navigate("/login");
      return;
    }
    navigate("/profile", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center dark:bg-gray-800 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <img
          src="/bus1.jpg"
          alt="Bus"
          className="w-full h-full object-cover opacity-60"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/80 z-0"></div>

      <div className="w-full max-w-6xl p-6 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 1,
          }}
          className="flex justify-between items-center mb-8 gap-x-4"
        >
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
              Elite Roadways
            </span>
          </h1>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/userdetails')}
                className="px-6 py-2 bg-white/10 backdrop-blur-md text-white font-medium rounded-lg shadow-lg hover:bg-white/20 transition duration-300 border border-white/20"
              >
                User Details
              </motion.button>
            )}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProfileClick}
              className="px-6 py-2 bg-white/10 backdrop-blur-md text-white font-medium rounded-lg shadow-lg hover:bg-white/20 transition duration-300 border border-white/20"
            >
              My Profile
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/mybookings')}
              className="px-6 py-2 bg-white/10 backdrop-blur-md text-white font-medium rounded-lg shadow-lg hover:bg-white/20 transition duration-300 border border-white/20"
            >
              My Bookings
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          {isAdmin && (
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddBus}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg text-white font-medium transition duration-300 shadow-lg text-lg tracking-wide"
            >
              Add Bus
            </motion.button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Search for Buses
          </h2>
          <form
            onSubmit={handleSearch}
            className="flex flex-col w-full max-w-md mx-auto space-y-4"
          >
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
              />
            </div>
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white font-medium transition duration-300 shadow-lg text-lg tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </motion.button>
          </form>
        </motion.div>

        {buses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-white text-center mb-6">
              Available Buses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buses.map((bus) => (
                <motion.div
                  key={bus._id}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBusClick(bus)}
                  className="cursor-pointer bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 hover:bg-white/20 transition duration-300"
                >
                  <h4 className="text-xl font-semibold text-white mb-2">
                    Bus Number: {bus.busnum}
                  </h4>
                  <div className="space-y-2 text-white/80">
                    <p className="flex items-center">
                      <span className="w-24 font-medium">Seats Available:</span>
                      <span className="ml-2">
                        {40 - (bus.bookedSeats?.length || 0)}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-24 font-medium">Departure:</span>
                      <span className="ml-2">
                        {new Date(bus.departuretime).toLocaleString()}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-24 font-medium">Origin:</span>
                      <span className="ml-2">{bus.origin}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-24 font-medium">Destination:</span>
                      <span className="ml-2">{bus.destination}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 text-center z-10 w-full"
      >
        <p className="text-sm text-white/70 font-light tracking-wide">
          © 2024 Elite Roadways. All Rights Reserved.
        </p>
      </motion.div>

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

export default Home;
