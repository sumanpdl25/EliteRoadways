import express from "express";
import { config } from "dotenv";
import { userRouter } from "./Routes/user.routes.js";
import { busRouter } from "./Routes/bus.routes.js";
import cookieParser from "cookie-parser";

config({
  path: "./config.env",
});

export const app = express();
app.use(express.json());
app.use(cookieParser())

app.use('/api/v1/users',userRouter)
app.use('/api/v1/bus',busRouter)

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
