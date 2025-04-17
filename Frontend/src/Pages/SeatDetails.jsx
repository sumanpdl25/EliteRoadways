import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const SeatDetails = () => {
  const { seatId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookedUser, setBookedUser] = useState(null);

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
        
        // If the seat is booked, get the booking details and user info
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

  const bookSeat = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const busId = localStorage.getItem("selectedBusId");
      const response = await axios.post(
        "/api/v1/bus/bookseat",
        {
          busId,
          seatNumber: seatId,
          userId: userProfile._id,
          pickupLocation: userProfile.address,
          contactNumber: userProfile.phone,
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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Seat Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Seat Information</h3>
              <p>Seat Number: {seatId}</p>
              <p>Bus Number: {busInfo?.busnum}</p>
              <p>Driver: {busInfo?.driver}</p>
              <p>Origin: {busInfo?.origin}</p>
              <p>Destination: {busInfo?.destination}</p>
              <p>Departure Time: {new Date(busInfo?.departuretime).toLocaleString()}</p>
              <p>Fare: NRS {busInfo?.fare}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">User Information</h3>
              {isAdmin && bookingDetails ? (
                <>
                  <p>Booked By: {bookedUser?.name}</p>
                  <p>Contact: {bookingDetails.contactNumber}</p>
                  <p>Pickup Location: {bookingDetails.pickupLocation}</p>
                </>
              ) : (
                <>
                  <p>Name: {userProfile?.name}</p>
                  <p>Email: {userProfile?.email}</p>
                </>
              )}
            </div>
          </div>

          {!bookingDetails && (
            <div className="mt-8">
              <button
                onClick={bookSeat}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatDetails;