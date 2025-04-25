import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Userdetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/v1/users/delete/${userId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        // Remove user from the state
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      } else {
        alert(response.data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Error deleting user. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [usersResponse, busesResponse] = await Promise.all([
          axios.get('http://localhost:4000/api/v1/users/all', {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }),
          axios.get('http://localhost:4000/api/v1/bus/getbus', {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          })
        ]);
        
        if (usersResponse.data.success && busesResponse.data.success) {
          // Combine user data with their bookings
          const usersWithBookings = usersResponse.data.users.map(user => {
            // Group bookings by bus
            const bookingsByBus = {};
            
            busesResponse.data.buses.forEach(bus => {
              if (bus.bookedBy && Array.isArray(bus.bookedBy)) {
                const userSeats = bus.bookedBy
                  .filter(booking => 
                    booking && booking.userId && booking.userId.toString() === user._id
                  )
                  .map(booking => booking.seat);

                if (userSeats.length > 0) {
                  const busKey = bus.busnum;
                  if (!bookingsByBus[busKey]) {
                    bookingsByBus[busKey] = {
                      busNumber: bus.busnum,
                      route: `${bus.origin} → ${bus.destination}`,
                      time: new Date(bus.departuretime).toLocaleString(),
                      seats: []
                    };
                  }
                  bookingsByBus[busKey].seats.push(...userSeats);
                }
              }
            });

            return {
              ...user,
              bookings: Object.values(bookingsByBus).sort((a, b) => a.busNumber.localeCompare(b.busNumber))
            };
          });
          
          setUsers(usersWithBookings);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Please login to view user details');
          navigate('/login');
        } else if (err.response?.status === 403) {
          setError('Access denied. Please login again.');
          navigate('/login');
        } else {
          setError('Error fetching data. Please make sure the backend server is running.');
          console.error('Error fetching data:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">User Details</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                  <td className="px-6 py-4">
                    {user.bookings && user.bookings.length > 0 ? (
                      <div className="space-y-3">
                        {user.bookings.map((booking, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">Bus:</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {booking.busNumber}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">Seats:</span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                {booking.seats.sort().join(', ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">Route:</span>
                              <span className="text-gray-700">{booking.route}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Time:</span>
                              <span className="text-gray-700">{booking.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No bookings</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role !== 'admin' ? (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user? This will also remove all their bookings.')) {
                            handleDeleteUser(user._id);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Delete User
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">Cannot delete admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
    </div>
  );
};

export default Userdetails;