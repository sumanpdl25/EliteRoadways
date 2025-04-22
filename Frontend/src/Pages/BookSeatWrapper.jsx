import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import BookSeat from "./BookSeat";

const BookSeatWrapper = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [busId, setBusId] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busInfo, setBusInfo] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchBusAndUserData = async () => {
      try {
        // Get bus ID from location state or localStorage
        const busIdFromState = location.state?.busId || localStorage.getItem("selectedBusId");
        if (!busIdFromState) {
          toast.error("No bus selected");
          navigate("/home");
          return;
        }
        setBusId(busIdFromState);

        // Get user profile to check admin status
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userResponse = await axios.get("/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(userResponse.data.user);
        setIsAdmin(userResponse.data.user.role === "admin");

        // Get bus details including booked seats
        const busResponse = await axios.get(`/api/v1/bus/getbus/${busIdFromState}`);
        const busData = busResponse.data.bus;
        setBusInfo(busData);
        setBookedSeats(busData.bookedSeats || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load bus information");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    fetchBusAndUserData();
  }, [location.state, navigate]);

  const handleSelectSeat = async (seat) => {
    if (!seat.available && !isAdmin) {
      toast.error("This seat is already booked");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "/api/v1/bus/bookseat",
        {
          busId,
          seatNumber: seat.id,
          userId: userProfile._id,
          pickupLocation: userProfile.address || "",
          contactNumber: userProfile.phone || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Seat booked successfully!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error booking seat:", error);
      toast.error(error.response?.data?.message || "Failed to book seat");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!busId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Bus Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Bus Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Bus Number:</p>
              <p className="font-semibold">{busInfo?.busnum}</p>
            </div>
            <div>
              <p className="text-gray-600">Driver Name:</p>
              <p className="font-semibold">{busInfo?.driver}</p>
            </div>
            <div>
              <p className="text-gray-600">Driver Contact:</p>
              <p className="font-semibold">{busInfo?.driverContact}</p>
            </div>
            <div>
              <p className="text-gray-600">Route:</p>
              <p className="font-semibold">{busInfo?.origin} → {busInfo?.destination}</p>
            </div>
            <div>
              <p className="text-gray-600">Departure Time:</p>
              <p className="font-semibold">{new Date(busInfo?.departuretime).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Fare:</p>
              <p className="font-semibold">NRS {busInfo?.fare}</p>
            </div>
          </div>
        </div>

        {/* Seat Selection */}
        <BookSeat
          selectedSeat={selectedSeat}
          onSelectSeat={handleSelectSeat}
          busId={busId}
          bookedSeats={bookedSeats}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default BookSeatWrapper; 