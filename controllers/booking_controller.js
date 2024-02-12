import mongoose from "mongoose";
import { Booking } from "../modles/booking.js";
import { Movie } from "../modles/movies.js";
import { User } from "../modles/user.js";

// CREATE NEW BOOKING USING POST METHOD

export const newBooking = async (req, res, next) => {
  //Getting user data from req body
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return res.status(500).send(error);
  }
  if (!existingMovie) {
    return res.status(404).send("Movie Not Found With Given ID");
  }
  if (!user) {
    return res.status(404).send("User not found with given ID ");
  }
  let booking;

  try {
    booking = new Booking({
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    session.commitTransaction();
  } catch (err) {
    return res.status(500).send(error);
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(200).json({ booking });
};
//get booking by id

export const getBookingById = async (req, res, next) => {
  const bookingId = req.params.id;
  let movieBookedById;

  try {
    movieBookedById = await Booking.findById(bookingId);

    if (!movieBookedById) {
      return res.status(404).send("Booking not Found !!!");
    }

 return   res.status(200).send(movieBookedById);
  } catch (error) {
  return  res.status(500).send(error);
  }
};

export const deleteBookingId = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Booking.findByIdAndDelete(id).populate("user movie");
    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });
    session.commitTransaction();
  } catch (error) {
    return res.status(500).send(error);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unable to Delete" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};
