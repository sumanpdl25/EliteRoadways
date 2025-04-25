import Bus from "../models/bus.model.js"; 
import jwt from "jsonwebtoken"

export const addBusHandler = async (req, res) => {
  try {

    const {
      busnum,
      date,
      origin,
      destination,
      fare,
      departuretime,
      driver,
      driverContact,
      seats,
    } = req.body;

  
    const createdBy = req.user._id; 

    const newBus = await Bus.create({
      busnum,
      date,
      origin,
      destination,
      fare,
      departuretime,
      driver,
      driverContact,
      seats,
      createdBy, 
    });

    res.status(201).json({
      success: true,
      message: "Bus added successfully",
      bus: newBus,
    });
  } catch (error) {
    console.error("Error adding bus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add bus. Please try again.",
    });
  }
};

export const getBusHandler = async (req, res) => {
  try {
    const buses = await Bus.find();
    
    const formattedBuses = buses.map(bus => {
      const busObj = bus.toObject();
    
      if (bus.bookedBy && bus.bookedBy instanceof Map) {
        busObj.bookedBy = Array.from(bus.bookedBy.entries()).map(([seat, booking]) => ({
          seat,
          userId: booking.userId ? booking.userId.toString() : null,
          pickupLocation: booking.pickupLocation,
          contactNumber: booking.contactNumber
        }));
      } else {
        busObj.bookedBy = [];
      }
      
      return busObj;
    });

    console.log('Formatted buses:', formattedBuses);
    res.status(200).json({ success: true, buses: formattedBuses });
  } catch (error) {
    console.error("Error getting buses:", error);
    res.status(500).json({ success: false, message: "Failed to get buses" });
  }
};

export const getBusByIdHandler = async (req, res) => {
  try {
    const { busId } = req.params;
    
    if (!busId) {
      return res.status(400).json({
        success: false,
        message: "Bus ID is required",
      });
    }
    
    const bus = await Bus.findById(busId).populate({
      path: 'bookedBy.$*.userId',
      select: 'username',
      model: 'User'
    });
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }
    
    res.status(200).json({
      success: true,
      bus,
    });
  } catch (error) {
    console.error("Error getting bus by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get bus details",
    });
  }
};

export const searchBusHandler = async (req, res) => {
  try {
    
    const { destination } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Please provide a destination to search for.",
      });
    }


    const buses = await Bus.find({ destination: new RegExp(destination, "i") });

  
    if (buses.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No buses found for destination: ${destination}`,
      });
    }


    res.status(200).json({
      success: true,
      buses: buses,
    });
  } catch (error) {
    console.error("Error searching buses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search buses. Please try again later.",
    });
  }
};

export const bookSeatHandler = async (req, res) => {
  const { busId, seatNumber, userId, pickupLocation, contactNumber } = req.body;

  try {
    // Find the bus by ID
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    // Check if the seat is already booked
    if (bus.bookedSeats.includes(seatNumber)) {
      return res.status(400).json({ success: false, message: "Seat already booked" });
    }

    // Validate required fields
    if (!pickupLocation || !contactNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Pickup location and contact number are required" 
      });
    }

    
    bus.bookedBy.set(seatNumber, { 
      userId, 
      pickupLocation,
      contactNumber
    });

    
    bus.bookedSeats.push(seatNumber);

  
    await bus.save();

    return res.status(200).json({ success: true, message: "Seat booked successfully" });
    
  } catch (error) {
    console.error("Error booking seat:", error);
    return res.status(500).json({ success: false, message: "Error booking seat", error: error.message });
  }
};