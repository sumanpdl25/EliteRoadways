import express from "express";
import { addBusHandler, bookSeatHandler, getBusHandler, getBusByIdHandler, searchBusHandler, cancelBookingHandler } from "../controllers/bus.controller.js";
export const busRouter = express.Router();
import isAuthenticated from "../utils/isAuthenticated.js";
import { isAdmin } from "../utils/isAdmin.js";


busRouter.post('/addbus', isAuthenticated, isAdmin, addBusHandler)
busRouter.get('/getbus', isAuthenticated, getBusHandler)
busRouter.get('/getbus/:busId', isAuthenticated, getBusByIdHandler)
busRouter.get('/search', isAuthenticated, searchBusHandler)
busRouter.post('/bookseat', isAuthenticated, bookSeatHandler);
busRouter.post("/cancelbooking", isAuthenticated, cancelBookingHandler);