import express from "express";
import { addBusHandler ,bookSeatHandler,getBusHandler, searchBusHandler} from "../controllers/bus.controller.js";
 export const busRouter = express.Router();
 import isAuthenticated from "../utils/isAuthenticated.js";
import { isAdmin } from "../utils/isAdmin.js";


 busRouter.post('/addbus', isAuthenticated,isAdmin, addBusHandler)
 busRouter.get('/getbus', isAuthenticated, getBusHandler)
 busRouter.get('/search', isAuthenticated, searchBusHandler)
 busRouter.post('/bookseat', isAuthenticated, bookSeatHandler);