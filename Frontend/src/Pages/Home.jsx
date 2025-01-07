import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// To decode JWT token
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function Home() {
  const [destination, setDestination] = useState("");
  const [buses, setBuses] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch all buses initially
  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        // Fetching buses from API
        const { data } = await axios.get("api/v1/bus/getbus");
        if (data.success) {
          setAllBuses(data.buses);
          setBuses(data.buses); // Set buses to display all initially
        } else {
          toast.error("Failed to fetch buses.");
        }
      } catch (error) {
        console.error("Error fetching buses:", error);
        toast.error("Failed to fetch buses.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Handle destination search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!destination) {
      toast.error("Please enter a destination to search.");
      return;
    }

    // Filter buses based on the destination
    const filteredBuses = allBuses.filter((bus) =>
      bus.destination.toLowerCase().includes(destination.toLowerCase())
    );
    setBuses(filteredBuses);

    if (filteredBuses.length === 0) {
      toast.error(`No buses found for destination: ${destination}`);
    }
  };

  // Handle the "Add Bus" button click (using React Router's navigate)
  const handleAddBus = () => {
    navigate("/addbus"); // This will take the user to the /addbus page
  };

  // Handle bus click to book a seat
  const handleBusClick = (bus) => {
    // For now, let's assume we are booking the first available seat.
    const availableSeat = bus.noOfSeats - bus.bookedSeats.length;

    if (availableSeat <= 0) {
      toast.error("No seats available for this bus.");
      return;
    }

    const userId = "someUserId"; // Replace with actual user ID (from context or auth)
    const pickupLocation = "somePickupLocation"; // Replace with actual pickup location (from context or input)

    // Navigate to the book seat page with necessary data
    navigate("/bookseat", {
      state: {
        busId: bus._id,
        seatNumber: availableSeat, // Use the first available seat number
        userId,
        pickupLocation,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 px-4">
      <h2 className="text-3xl font-bold text-white mb-6">Search for Buses</h2>
      <form onSubmit={handleSearch} className="flex flex-col w-full max-w-sm space-y-4 bg-white bg-opacity-80 p-6 rounded-xl shadow-lg">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Conditionally render the "Add Bus" button for admin */}
      {
        <button
          onClick={handleAddBus} // Trigger navigate to /addbus
          className="mt-6 px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-lg hover:bg-green-700 transition duration-300 ease-in-out"
        >
          Add Bus
        </button>
      }

      {/* Display available buses */}
      {buses.length > 0 && (
        <div className="mt-6 space-y-4 w-full max-w-3xl">
          <h3 className="text-2xl text-white">Available Buses</h3>
          <div className="space-y-4">
            {buses.map((bus) => (
              <div
                key={bus._id}
                onClick={() => handleBusClick(bus)} // Make the bus item clickable
                className="cursor-pointer bg-white p-4 rounded-lg shadow-lg hover:bg-gray-100"
              >
                <h4 className="text-xl font-semibold text-gray-800">Bus Number: {bus.busnum}</h4>
                <p className="text-gray-700">Seats Available: {bus.noOfSeats - bus.bookedSeats.length}</p>
                <p className="text-gray-700">Departure Time: {new Date(bus.departuretime).toLocaleString()}</p>
                <p className="text-gray-700">Origin: {bus.origin}</p>
                <p className="text-gray-700">Destination: {bus.destination}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Home;
