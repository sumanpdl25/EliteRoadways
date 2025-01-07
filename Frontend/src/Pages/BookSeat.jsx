import  { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// SeatingChart Component to Display All Seats Dynamically
function SeatingChart({ totalRows, totalColumns, selectedSeat, onSelectSeat }) {
  const createSeats = () => {
    const seats = [];
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= totalColumns; col++) {
        const seatNumber = `${row}${String.fromCharCode(64 + col)}`; // e.g., "1A", "1B", etc.
        seats.push({
          number: seatNumber,
          available: true, // Here you can add a condition to check availability
          selected: seatNumber === selectedSeat,
        });
      }
    }
    return seats;
  };

  const seats = createSeats(); // Generate seats based on rows and columns

  return (
    <div className="grid grid-cols-6 gap-2 mb-4">
      {seats.map((seat, index) => (
        <button
          key={index}
          onClick={() => onSelectSeat(seat)}
          className={`px-4 py-2 rounded-md border w-full ${
            seat.selected
              ? "bg-blue-600 text-white"
              : seat.available
              ? "bg-green-400 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
          disabled={!seat.available}
        >
          {seat.number}
        </button>
      ))}
    </div>
  );
}

// PropTypes for SeatingChart to validate props
SeatingChart.propTypes = {
  totalRows: PropTypes.number.isRequired,
  totalColumns: PropTypes.number.isRequired,
  selectedSeat: PropTypes.string.isRequired,
  onSelectSeat: PropTypes.func.isRequired,
};

function BookSeat() {
  const { state } = useLocation(); // Get data passed from the previous page
  const navigate = useNavigate();

  // Validate `state` to ensure necessary data exists
  const busId = state?.busId || null;
  const initialSeatNumber = state?.seatNumber || "";
  const initialPickupLocation = state?.pickupLocation || "";

  // State hooks
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // For storing user data
  const [userLoading, setUserLoading] = useState(true); // To track loading state of user data
  const [seatNumber, setSeatNumber] = useState(initialSeatNumber); // For storing seat number input
  const [pickupLocation, setPickupLocation] = useState(initialPickupLocation); // For storing pickup location input

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/v1/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        alert("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("Error fetching user profile.");
    } finally {
      setUserLoading(false); // Set loading to false after API call
    }
  };

  // Book the seat
  const bookSeat = async () => {
    if (!user) {
      alert("User data is missing.");
      return;
    }

    if (!seatNumber || !pickupLocation) {
      alert("Please select a seat and provide a pickup location.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/v1/bus/bookseat", {
        busId,
        seatNumber: seatNumber.toString(), // Ensure seatNumber is a string
        userId: user._id,
        pickupLocation,
      });
      console.log(response.data);

      if (response.data.success) {
        alert(response.data.message || "Seat booked successfully!");
        navigate("/"); // Navigate after booking
      } else {
        alert("Failed to book seat.");
      }
    } catch (error) {
      console.error("Error booking seat:", error);
      alert("Error booking seat.");
    } finally {
      setLoading(false);
    }
  };

  // Validate state and fetch user profile
  useEffect(() => {
    if (!busId || !initialSeatNumber || !initialPickupLocation) {
      alert("Invalid data. Please try again.");
      navigate("/"); // Navigate to a safe place if data is invalid
    } else {
      fetchUserProfile();
    }
  }, [busId, initialSeatNumber, initialPickupLocation, navigate]);

  // Handle seat selection
  const handleSelectSeat = (seat) => {
    if (seat.available) {
      setSeatNumber(seat.number); // Set selected seat number
    }
  };

  // If the user data is still loading, show a loading message
  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 px-4">
      <h2 className="text-3xl font-bold text-white mb-6">Book Your Seat</h2>

      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-gray-800">Bus Information</h3>

        <div className="mb-4">
          <label className="block text-gray-700">Bus ID: {busId}</label>

          {/* Display seat selection grid */}
          <label className="block text-gray-700 mt-2">Choose a Seat:</label>
          <SeatingChart
            totalRows={10} // Number of rows in the bus
            totalColumns={6} // Number of seats per row (A, B, C, D, E, F)
            selectedSeat={seatNumber} // Highlight the selected seat
            onSelectSeat={handleSelectSeat} // Handle seat selection
          />

          {/* Pickup Location */}
          <label className="block text-gray-700 mt-2">Pickup Location:</label>
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="px-4 py-3 rounded-md border border-gray-300 w-full"
            placeholder="Enter pickup location"
          />
        </div>

        {/* User Information */}
        {user && (
          <div className="mb-4">
            <label className="block text-gray-700">User ID: {user._id}</label>
            <label className="block text-gray-700">Email: {user.email}</label>
          </div>
        )}

        {/* Booking Confirmation */}
        <div className="mb-4">
          <button
            onClick={bookSeat}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

// PropTypes for BookSeat to validate props
BookSeat.propTypes = {
  state: PropTypes.shape({
    busId: PropTypes.string.isRequired,
    seatNumber: PropTypes.string,
    pickupLocation: PropTypes.string,
  }),
};

export default BookSeat;
