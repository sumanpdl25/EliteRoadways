import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddBus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    busnum: "",
    date: "",
    origin: "",
    destination: "",
    fare: "",
    departuretime: "",
    driver: "",
    driverContact: "",
    seats: 40, // Fixed value for seats
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of formData to modify
      const submissionData = { ...formData };
      
      // Convert fare to a number
      submissionData.fare = Number(submissionData.fare);
      
      // Combine date and time for departuretime
      if (submissionData.date && submissionData.departuretime) {
        const [hours, minutes] = submissionData.departuretime.split(':');
        const departureDate = new Date(submissionData.date);
        departureDate.setHours(parseInt(hours, 10));
        departureDate.setMinutes(parseInt(minutes, 10));
        submissionData.departuretime = departureDate.toISOString();
      }
      
      // Ensure all required fields are present
      if (!submissionData.driverContact) {
        toast.error("Driver contact number is required");
        return;
      }
      
      if (!submissionData.fare || isNaN(submissionData.fare)) {
        toast.error("Valid fare amount is required");
        return;
      }
      
      const response = await axios.post("/api/v1/bus/addbus", submissionData);
      if (response.data.success) {
        toast.success("Bus added successfully!");
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding bus");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Bus</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Bus Number
          </label>
          <input
            type="text"
            name="busnum"
            value={formData.busnum}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Origin
          </label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Destination
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fare
          </label>
          <input
            type="number"
            name="fare"
            value={formData.fare}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Departure Time
          </label>
          <input
            type="time"
            name="departuretime"
            value={formData.departuretime}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Driver
          </label>
          <input
            type="text"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Driver Contact Number
          </label>
          <input
            type="tel"
            name="driverContact"
            value={formData.driverContact}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
          />
        </div>
        {/* Hidden input for fixed seats */}
        <input type="hidden" name="seats" value={formData.seats} />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Bus
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBus;
