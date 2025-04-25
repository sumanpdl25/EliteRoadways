import express from "express";
import { config } from "dotenv";
import { userRouter } from "./Routes/user.routes.js";
import { busRouter } from "./Routes/bus.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bus', busRouter);

app.get("/", (req, res) => {
  res.send("Server is running on port 4000");
});
