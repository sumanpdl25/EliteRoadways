import express from "express";
 export const userRouter = express.Router();
import { loginhandeler, signuphandeler,logouthandeler,profile } from "../controllers/user.controller.js";
import isAuthenticated from "../utils/isAuthenticated.js";

userRouter.post("/login", loginhandeler);
userRouter.post("/signup", signuphandeler);
userRouter.get("/logout",  isAuthenticated,logouthandeler);
userRouter.get("/profile", isAuthenticated, profile);




