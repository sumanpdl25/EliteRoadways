import Bus from "../models/bus.model.js"; // Import Bus model
import jwt from "jsonwebtoken"; // For decoding the JWT

export const addBusHandler = async (req, res) => {
  try {
    // Extract bus data from the request body
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

    // Extract the userID from the JWT token (which should be in req.user if the middleware is set)
    const createdBy = req.user._id; // Assuming your authentication middleware sets `req.user`

    // Create the new bus entry
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
      createdBy, // The createdBy is now set to the user's ObjectId
    });

    // Respond with the created bus data
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
    res.status(200).json({ success: true, buses });
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
    // Capture the 'destination' query parameter from the request
    const { destination } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Please provide a destination to search for.",
      });
    }

    // Query the Bus collection to find buses with the matching destination
    const buses = await Bus.find({ destination: new RegExp(destination, "i") });

    // If no buses are found, return a message
    if (buses.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No buses found for destination: ${destination}`,
      });
    }

    // If buses are found, return the results
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

    // Store the booking details
    bus.bookedBy.set(seatNumber, { 
      userId, 
      pickupLocation,
      contactNumber
    });

    // Update the bookedSeats array
    bus.bookedSeats.push(seatNumber);

    // Save the updated bus information
    await bus.save();

    return res.status(200).json({ success: true, message: "Seat booked successfully" });
    
  } catch (error) {
    console.error("Error booking seat:", error);
    return res.status(500).json({ success: false, message: "Error booking seat", error: error.message });
  }
};