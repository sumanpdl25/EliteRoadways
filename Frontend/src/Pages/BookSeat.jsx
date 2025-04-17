import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

// BookSeat Component to Display Bus Layout with 40 Seats (10 rows x 4 columns)
function BookSeat({ selectedSeat, onSelectSeat, busId, bookedSeats, isAdmin }) {
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
  const navigate = useNavigate();

  const handleSeatClick = (seat) => {
    if (!seat.available && !isAdmin) {
      toast.error("This seat is already booked");
      return;
    }
    onSelectSeat(seat);
    // Store the bus ID in localStorage for the SeatDetails page
    localStorage.setItem("selectedBusId", busId);
    // Navigate to SeatDetails with the seat ID as a parameter
    navigate(`/seat-details/${seat.id}`);
  };

  return (
    <div className="bus-layout relative w-full max-w-4xl mx-auto p-4 bg-gray-100 rounded-lg">
      {/* Bus front */}
      <div className="bus-front h-16 bg-blue-600 rounded-t-lg flex items-center justify-center">
        <div className="w-24 h-8 bg-yellow-400 rounded-full"></div>
        <div className="w-24 h-8 bg-yellow-400 rounded-full ml-4"></div>
      </div>
      
      {/* Driver's area */}
      <div className="driver-area h-20 bg-gray-300 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-bold">D</span>
        </div>
      </div>
      
      {/* Main seating area */}
      <div className="seating-area p-4">
        {/* All rows (1-10) */}
        <div className="all-rows grid grid-cols-9 gap-2">
          {/* Left side seats (2 seats) */}
          <div className="col-span-4 grid grid-cols-2 gap-4">
            {seats.filter((_, index) => index % 4 < 2).map((seat, index) => (
              <button
                key={`left-${index}`}
                onClick={() => handleSeatClick(seat)}
                className={`sofa-seat h-20 rounded-lg border-2 flex items-center justify-center relative overflow-hidden shadow-md ${
                  seat.selected
                    ? "border-blue-800"
                    : seat.available
                    ? "border-green-600 hover:shadow-lg"
                    : "border-red-600"
                }`}
                disabled={!seat.available && !isAdmin}
              >
                {/* Sofa back */}
                <div className="absolute top-0 left-0 right-0 h-6 rounded-t-lg" 
                     style={{ 
                       backgroundColor: seat.selected ? '#1e40af' : seat.available ? '#34d399' : '#ef4444',
                       boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)'
                     }}></div>
                
                {/* Sofa seat cushion */}
                <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-lg" 
                     style={{ 
                       backgroundColor: seat.selected ? '#2563eb' : seat.available ? '#4ade80' : '#dc2626',
                       boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                     }}></div>
                
                {/* Sofa armrests */}
                <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg" 
                     style={{ 
                       backgroundColor: seat.selected ? '#1e3a8a' : seat.available ? '#059669' : '#b91c1c',
                       boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
                     }}></div>
                <div className="absolute right-0 top-0 bottom-0 w-2 rounded-r-lg" 
                     style={{ 
                       backgroundColor: seat.selected ? '#1e3a8a' : seat.available ? '#059669' : '#b91c1c',
                       boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
                     }}></div>
                
                {/* Seat number */}
                <span className="font-bold z-10 text-lg">{seat.number}</span>
              </button>
            ))}
          </div>
          
          {/* Center aisle */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-1/2 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          {/* Right side seats (2 seats) */}
          <div className="col-span-4 grid grid-cols-2 gap-4">
            {seats.filter((_, index) => index % 4 >= 2).map((seat, index) => (
              <button
                key={`right-${index}`}
                onClick={() => handleSeatClick(seat)}
                className={`sofa-seat h-20 rounded-lg border-2 flex items-center justify-center relative overflow-hidden shadow-md ${
                  seat.selected
                    ? "border-blue-800"
                    : seat.available
                    ? "border-green-600 hover:shadow-lg"
                    : "border-red-600"
                }`}
                disabled={!seat.available && !isAdmin}
              >
                {/* Sofa back */}
                <div className="absolute top-0 left-0 right-0 h-6 rounded-t-lg" 
                     style={{ 
                       backgroundColor: seat.selected ? '#1e40af' : seat.available ? '#34d399' : '#ef4444',
                       boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1)'
                     }}></div>
                
                {/* Sofa seat cushion */}
                <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-lg" 
                     style={{ 
                       backgroundColor: seat.selected ? '#2563eb' : seat.available ? '#4ade80' : '#dc2626',
                       boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                     }}></div>
                
                {/* Sofa armrests */}
                <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg" 
                     style={{ 
                       backgroundColor: seat.selected ? '#1e3a8a' : seat.available ? '#059669' : '#b91c1c',
                       boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
                     }}></div>
                <div className="absolute right-0 top-0 bottom-0 w-2 rounded-r-lg" 
                     style={{ 
                       backgroundColor: seat.selected ? '#1e3a8a' : seat.available ? '#059669' : '#b91c1c',
                       boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)'
                     }}></div>
                
                {/* Seat number */}
                <span className="font-bold z-10 text-lg">{seat.number}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bus back */}
      <div className="bus-back h-8 bg-blue-600 rounded-b-lg"></div>
      
      {/* Legend */}
      <div className="legend mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 rounded mr-1"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded mr-1"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-1"></div>
          <span className="text-sm">Booked</span>
        </div>
      </div>
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
