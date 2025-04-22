import express from "express";
export const userRouter = express.Router();
import { loginhandeler, signuphandeler, logouthandeler, profile, getAllUsers, deleteUser } from "../controllers/user.controller.js";
import isAuthenticated from "../utils/isAuthenticated.js";
import { isAdmin } from "../utils/isAdmin.js";

userRouter.post("/login", loginhandeler);
userRouter.post("/signup", signuphandeler);
userRouter.get("/logout", isAuthenticated, logouthandeler);
userRouter.get("/profile", isAuthenticated, profile);
userRouter.get("/all", isAuthenticated, isAdmin, getAllUsers);
userRouter.delete('/delete/:userId', isAuthenticated, isAdmin, deleteUser);




