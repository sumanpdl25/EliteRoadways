import express from "express";
import { config } from "dotenv";
import { userRouter } from "./Routes/user.routes.js";
import { busRouter } from "./Routes/bus.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bus', busRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
