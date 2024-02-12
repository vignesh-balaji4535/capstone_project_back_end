import { Movie } from "../modles/movies.js";
import jwt from "jsonwebtoken";
import env from "dotenv";
import mongoose from "mongoose";
import { Admin } from "../modles/admin.js";
env.config();

//**********************************************************************
// ADDING THE NEW MOVIE BY ADMIN TOKEN

export const createNewMovie = async (req, res, next) => {
  // getting the token from auth header

  const extractToken = req.headers.authorization;

  // checking the token is there

  if (!extractToken && extractToken.trim() === "") {
    return res.status(404).send("Invaild token");
  }

  //verify token by jwt verify method

  let token = extractToken.slice(7);

  const tokenData = jwt.verify(token, process.env.SECRECT_KEY);

  //getting user id as  pay load from token

  const admin_id = tokenData.admin_id;

  if (!tokenData) {
    return res.status(402).send("token expried !!!");
  }

  // create new movie .. . and getting user input from req.body

  let { title } = req.body;
  const { discription, posterUrl, releaseDate, longPoster, actors, featured } =
    req.body;

  title = await title.toUpperCase();

  if (
    !title &&
    !discription &&
    !posterUrl &&
    !longPoster &&
    !releaseDate &&
    !actors &&
    !featured
  ) {
    return res.status(404).send("required all data of movie");
  }

  let newMovie;
  let movieExist;

  try {
    newMovie = new Movie({
      title: await title.toUpperCase(),
      discription,
      releaseDate: new Date(`${releaseDate}`),
      posterUrl,
      actors,
      featured,
      bookings: [],
      admin: admin_id,
      longPoster,
    });
    //storing new movie to DB using save()

    movieExist = await Movie.findOne({ title });

    if (movieExist) {
      return res.status(402).send("Movie Already exist");
    }

    newMovie = await newMovie.save();
    if (!newMovie) {
      return res.status(500).send("error Accoreded");
    }
    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(admin_id);

    session.startTransaction();

    newMovie = await newMovie.save({ session });

    adminUser.addedMovie.push(newMovie);

    await adminUser.save({ session });
    await session.commitTransaction();

    return res.status(201).send("movie added successfully");
  } catch (error) {
    return res.status(500).send(error);
  }
};

//**************************************************************************************
// GETTING ALL MOVIE'S FROM THE USER WITH GET METHOD

export const getAllMovies = async (req, res, next) => {
  let AllMovies;

  try {
    AllMovies = await Movie.find();

    if (!AllMovies) {
      return res.status(500).send("Request Failed");
    }
  } catch (error) {
    return res.status(500).send(error);
  }

  return res.status(201).send(AllMovies);
};

//*****************************************************************
// GET MOVIE BY ID , ID PASS IN REQ .PARAMS

export const getMovies = async (req, res, next) => {
  //getting id from req.params
  const id = req.params.id;

  let movie;
  try {
    //serching movie by id
    movie = await Movie.findById(id, {});

    if (!movie) {
      return res.status(404).send("Invaild movie Id");
    }

    return res.status(200).send(movie);
  } catch (error) {
  return  res.status(500).send(error);
  }
};
