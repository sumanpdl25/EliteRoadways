import mongoose from "mongoose";
import User from "./user.model.js";

// Define the schema
const BusSchema = new mongoose.Schema(
  {
    busnum: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    departuretime: {
      type: Date,
      required: true,
    },
    seats: {
      type: Number,
      default: 40,
      immutable: true, // This ensures the value cannot be changed after creation
    },
    boardingPoint: {
      type: String, // Optional: You can store default boarding point if you want
      // required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    bookedSeats: {
      type: [String], // Array to store booked seat numbers
      default: [],
    },
    bookedBy: {
      type: Map, // Map to associate seat numbers with objects containing userId, pickup location, and contact number
      of: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        pickupLocation: { type: String },
        contactNumber: { type: String },
      },
      default: {},
    },
    driver: {
      type: String,
      required: true,
    },
    driverContact: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model based on the schema
const Bus = mongoose.model("Bus", BusSchema);

// Export the model
export default Bus;
