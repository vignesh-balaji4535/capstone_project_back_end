import express from "express";
import dotenv from "dotenv";
import {
  loginUser,
  getAllUser,
  registerUser,
  updateUser,
  deleteUser,
  getUserBookingById,
  forgotPassword,
  otpVerify,
  passwordRest,
} from "../controllers/user_controller.js";
dotenv.config();

const Router = express.Router();

//Get all User's Data
Router.get("/", getAllUser);

// posting a new user -Account Creating
Router.post("/register", registerUser);

//forgot password -password rest
Router.post("/forgot",forgotPassword)

//validate otp
Router.post("/forgot/:token",otpVerify)

//reset password
Router.post("/forgot/:token/newpass",passwordRest)

//Login a user --post method;
Router.post("/login", loginUser);

//Updating user details --put method;
Router.put("/:id", updateUser);

//Deleting user Account from DB
Router.delete("delete/:id", deleteUser);

//get user booking by id ;
Router.get("/bookings/:id",getUserBookingById)

export const UserRouter = Router;
