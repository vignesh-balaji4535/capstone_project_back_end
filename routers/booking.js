
import express from "express";
import { deleteBookingId, getBookingById, newBooking } from "../controllers/booking_controller.js";

const Router = express.Router();

// booking the movie and seat
Router.post("/seatbooking", newBooking );

// get booking by id
Router.get("/:id", getBookingById );
//delete booking by id from movie ,booking and user
Router.delete("/delete/:id",deleteBookingId)

export const BookingRouter = Router;
