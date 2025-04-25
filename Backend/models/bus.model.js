import mongoose from "mongoose";
import User from "./user.model.js";


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
      type: String, 
      
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    bookedSeats: {
      type: [String], 
      default: [],
    },
    bookedBy: {
      type: Map, 
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

const Bus = mongoose.model("Bus", BusSchema);


export default Bus;
